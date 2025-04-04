from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input, decode_predictions
from tensorflow.keras.preprocessing import image
import numpy as np

# Load Pre-Trained Model
model = MobileNetV2(weights="imagenet")  # No need to train

def classify_image(img_path):
    try:
        # Load and preprocess the image
        img = image.load_img(img_path, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)

        # Get predictions from the model
        preds = model.predict(img_array)
        
        # Decode predictions to get readable class labels and confidence scores
        decoded_preds = decode_predictions(preds, top=3)[0]  # Get top 3 predictions

        # Format predictions to include the label and confidence as a float
        predictions = [{"label": label, "confidence": float(score)} for (_, label, score) in decoded_preds]
        
        return predictions

    except Exception as e:
        print(f"Error in classify_image: {e}")
        return [{"error": str(e)}]
