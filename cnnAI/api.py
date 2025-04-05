from flask import Flask, request, jsonify
from model import classify_image  
import os

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)


    predictions = classify_image(file_path)


    return jsonify({"predictions": predictions})

if __name__ == "__main__":
    app.run(port=5001, debug=True)
