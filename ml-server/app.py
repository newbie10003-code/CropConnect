import tensorflow as tf # type: ignore
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import numpy as np
from PIL import Image

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

model = tf.keras.models.load_model(r'Models\Model5.h5')


def preprocess_image(image_path):
    image = Image.open(image_path)
    image = image.resize((224, 224)) 
    image = np.array(image) / 255.0 
    image = np.expand_dims(image, axis=0)  
    return image

@app.route('/crop-disease-predict', methods=['POST'])
def crop_disease_predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    try:
        image_data = preprocess_image(file_path)
        prediction = model.predict(image_data)
        predicted_class = np.argmax(prediction, axis=1)[0]
        return jsonify({"success": True, "prediction": str(predicted_class)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001, debug=True)
