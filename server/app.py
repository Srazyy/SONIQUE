from flask import Flask, request, jsonify
from flask_cors import CORS
import os

# ---------------- Flask Setup ----------------
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

# ---------------- Run ----------------
if __name__ == "__main__":
    app.run(debug=True)
