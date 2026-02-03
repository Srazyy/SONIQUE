from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import librosa
import csv
import subprocess
import sqlite3

# ---------------- Flask Setup ----------------
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

DB_PATH = "sounds.db"

# ---------------- Database Setup ----------------
def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS sounds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lat REAL,
            lng REAL,
            label TEXT,
            confidence REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def save_to_db(lat, lng, results):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    for r in results:
        c.execute(
            "INSERT INTO sounds (lat, lng, label, confidence) VALUES (?, ?, ?, ?)",
            (lat, lng, r["label"], r["confidence"])
        )
    conn.commit()
    conn.close()

def fetch_history():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT lat, lng, label, confidence, timestamp FROM sounds")
    rows = c.fetchall()
    conn.close()
    return [
        {"lat": row[0], "lng": row[1], "label": row[2], "confidence": row[3], "timestamp": row[4]}
        for row in rows
    ]

# Init DB at startup
init_db()

# ---------------- YAMNet Setup ----------------
yamnet_model_handle = "https://tfhub.dev/google/yamnet/1"
yamnet_model = hub.load(yamnet_model_handle)

def class_names_from_csv(class_map_csv_path):
    class_names = []
    with tf.io.gfile.GFile(class_map_csv_path) as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            class_names.append(row["display_name"])
    return class_names

class_map_path = yamnet_model.class_map_path().numpy().decode("utf-8")
class_names = class_names_from_csv(class_map_path)

# ---------------- Audio Utils ----------------
def convert_to_wav(input_path, output_path):
    try:
        subprocess.run([
            "ffmpeg", "-y", "-i", input_path,
            "-ar", "16000", "-ac", "1", output_path
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return True
    except Exception as e:
        print("❌ FFmpeg conversion failed:", str(e))
        return False

def classify_audio(file_path, top_k=3):
    try:
        print(f"🎧 Loading audio from: {file_path}")
        
        # Load audio with librosa
        waveform, sr = librosa.load(file_path, sr=16000, mono=True)
        print(f"✅ Loaded audio: shape={waveform.shape}, sr={sr}")
        
        # Check if audio is empty or too short
        if len(waveform) == 0:
            return [{"label": "No audio detected", "confidence": 0.0}]
        
        if len(waveform) < 16000:  # Less than 1 second
            print("⚠️ Audio is very short, padding...")
            waveform = np.pad(waveform, (0, 16000 - len(waveform)))

        # Normalize
        waveform = waveform.astype(np.float32)
        max_val = np.abs(waveform).max()
        if max_val > 0:
            waveform = waveform / max_val
        
        print("🤖 Running YAMNet inference...")
        
        # Run inference
        scores, embeddings, spectrogram = yamnet_model(waveform)
        print(f"✅ Inference complete: scores shape={scores.shape}")

        # Get mean scores
        mean_scores = tf.reduce_mean(scores, axis=0).numpy()

        # Get top K results
        top_indices = mean_scores.argsort()[-top_k:][::-1]
        results = [
            {"label": class_names[i], "confidence": float(mean_scores[i])}
            for i in top_indices
        ]

        print(f"🎯 Top predictions: {results}")
        return results
        
    except Exception as e:
        print(f"🔥 Error in classify_audio: {str(e)}")
        import traceback
        traceback.print_exc()
        return [{"label": f"Classification error", "confidence": 0.0}]

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

def parse_float(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return None

@app.route("/upload", methods=["POST"])
def upload():
    try:
        if "audio" not in request.files:
            return jsonify({"error": "No audio file"}), 400

        file = request.files["audio"]
        lat = parse_float(request.form.get("lat"))
        lng = parse_float(request.form.get("lng"))

        print(f"📍 Received upload: lat={lat}, lng={lng}")

        raw_filename = f"{uuid.uuid4().hex}.webm"
        raw_path = os.path.join(UPLOAD_FOLDER, raw_filename)
        file.save(raw_path)
        print(f"✅ Saved raw file: {raw_path}")

        wav_filename = raw_filename.replace(".webm", ".wav")
        wav_path = os.path.join(UPLOAD_FOLDER, wav_filename)
        
        if not convert_to_wav(raw_path, wav_path):
            print("❌ Conversion failed")
            return jsonify({"error": "Failed to convert audio"}), 500

        print(f"✅ Converted to WAV: {wav_path}")

        # Check if WAV file exists and has content
        if not os.path.exists(wav_path) or os.path.getsize(wav_path) == 0:
            return jsonify({"error": "WAV file is empty or doesn't exist"}), 500

        print("🎵 Starting classification...")
        results = classify_audio(wav_path)
        print(f"✅ Classification results: {results}")

        if lat is not None and lng is not None:
            save_to_db(lat, lng, results)
            print("💾 Saved to database")

        response = {"results": results}
        if lat is not None:
            response["lat"] = lat
        if lng is not None:
            response["lng"] = lng

        # Cleanup files
        try:
            os.remove(raw_path)
            os.remove(wav_path)
        except:
            pass

        return jsonify(response)

    except Exception as e:
        print(f"🔥 Server error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route("/history", methods=["GET"])
def history():
    data = fetch_history()
    return jsonify({"history": data})

# ---------------- Run ----------------
if __name__ == "__main__":
    app.run(debug=True)
