from flask import Flask, request, jsonify
from model import classify_image  # Make sure this import works
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

    # Call the classify_image function to get predictions
    predictions = classify_image(file_path)

    # Return predictions as a JSON response
    return jsonify({"predictions": predictions})

if __name__ == "__main__":
    app.run(port=5001, debug=True)
