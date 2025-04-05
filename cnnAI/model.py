from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input, decode_predictions
from tensorflow.keras.preprocessing import image
import numpy as np


model = MobileNetV2(weights="imagenet") 

def classify_image(img_path):
    try:
        img = image.load_img(img_path, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)

        preds = model.predict(img_array)
        
        
        decoded_preds = decode_predictions(preds, top=3)[0] 


        predictions = [{"label": label, "confidence": float(score)} for (_, label, score) in decoded_preds]
        
        return predictions

    except Exception as e:
        print(f"Error in classify_image: {e}")
        return [{"error": str(e)}]
