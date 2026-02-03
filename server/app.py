from flask import Flask, request, jsonify
from flask_cors import CORS
import os
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

        # Save uploaded file
        import uuid
        raw_filename = f"{uuid.uuid4().hex}.webm"
        raw_path = os.path.join(UPLOAD_FOLDER, raw_filename)
        file.save(raw_path)

        # Placeholder for audio classification (will be added later)
        results = [{"label": "Sound detected", "confidence": 0.9}]

        if lat is not None and lng is not None:
            save_to_db(lat, lng, results)

        response = {"results": results}
        if lat is not None:
            response["lat"] = lat
        if lng is not None:
            response["lng"] = lng

        # Cleanup
        try:
            os.remove(raw_path)
        except:
            pass

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route("/history", methods=["GET"])
def history():
    data = fetch_history()
    return jsonify({"history": data})

# ---------------- Run ----------------
if __name__ == "__main__":
    app.run(debug=True)

