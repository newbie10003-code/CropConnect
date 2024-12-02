import base64
import os
import logging
import tensorflow as tf
import cv2
import numpy as np
import sqlite3
from flask import Flask, json, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from PIL import Image
from datetime import datetime
from jwt.exceptions import ExpiredSignatureError, DecodeError
from dotenv import load_dotenv
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.platypus import Table, TableStyle
from reportlab.lib import colors
import os
import sqlite3
import cv2

load_dotenv()

app = Flask(__name__)
CORS(
    app, 
    origins=[
        "https://crop--connect.vercel.app", 
        "https://cropconnect-48a7.onrender.com" 
    ], 
    supports_credentials=True
)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

logging.basicConfig(level=logging.INFO)

JWT_SECRET = os.getenv("JWT_SECRET")
if not JWT_SECRET:
    raise ValueError("JWT_SECRET not found in the environment variables")

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

model_weights_path = r"C:\Users\KAJAL\Desktop\MajorProject\crop_connect\ml_server\Models\EfficientNet.keras\EfficientNet.keras"
model_config_path = r"C:\Users\KAJAL\Desktop\MajorProject\crop_connect\ml_server\Models\EfficientNet.keras\config.json"

if not os.path.exists(model_weights_path) or not os.path.exists(model_config_path):
    raise FileNotFoundError("Model weights or configuration file not found.")

with open(model_config_path, "r") as f:
    model_config = tf.keras.models.model_from_json(f.read())
model_config.load_weights(model_weights_path)
model = model_config

def preprocess_image(image):
    try:
        image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        sharpening_kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
        image = cv2.filter2D(image, -1, sharpening_kernel)
        image = cv2.GaussianBlur(image, (5, 5), 0)
        clahe = cv2.createCLAHE(clipLimit=4.0, tileGridSize=(3, 3))
        image = clahe.apply(image)
        image = cv2.resize(image, (224, 224))
        image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
        image = np.expand_dims(image, axis=0)  # Shape: (1, 224, 224, 3)
        return image
    except Exception as e:
        raise ValueError(f"Error preprocessing the image: {e}")
    
def create_reports_db():
    conn = sqlite3.connect('reports.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            report_type TEXT NOT NULL,
            input_image BLOB NOT NULL,
            report_data BLOB NOT NULL,
            prediction TEXT NOT NULL,
            probabilities TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP   
        );
    ''')
    conn.commit()
    conn.close()

create_reports_db()

disease_classes = [
    "Cashew anthracnose", "Cashew gumosis", "Cashew healthy", "Cashew leaf miner",
    "Cashew red rust", "Cassava bacterial blight", "Cassava brown spot", "Cassava green mite",
    "Cassava healthy", "Cassava mosaic", "Corn___Common_Rust", "Corn___Gray_Leaf_Spot",
    "Corn___Healthy", "Corn___Northern_Leaf_Blight", "Maize fall armyworm", "Maize grasshopper",
    "Maize healthy", "Maize leaf beetle", "Maize leaf blight", "Maize leaf spot", "Maize streak virus",
    "Potato___Early_Blight", "Potato___Healthy", "Potato___Late_Blight", "Rice___Brown_Spot",
    "Rice___Healthy", "Rice___Leaf_Blast", "Rice___Neck_Blast", "Sugarcane_Bacterial Blight",
    "Sugarcane_Healthy", "Sugarcane_Red Rot", "Tomato healthy", "Tomato leaf blight",
    "Tomato leaf curl", "Tomato septoria leaf spot", "Tomato verticillium wilt", "Wheat___Brown_Rust",
    "Wheat___Healthy", "Wheat___Yellow_Rust"
]

def generate_and_store_report(user_id, username, disease_name, probabilities, img):
    try:
        pdf_buffer = BytesIO()
        c = canvas.Canvas(pdf_buffer, pagesize=letter)
        page_width, page_height = letter

        c.setFont("Helvetica-Bold", 50)
        c.setFillColorRGB(0.8, 0.8, 0.8)
        c.saveState()
        c.setFont("Helvetica-Bold", 110)
        c.setFillColorRGB(0.9, 0.9, 0.9) 
        c.saveState()
        c.rotate(45)
        c.drawString(page_width/4, page_height / 10, "Crop Connect") 
        c.restoreState()

        
        c.restoreState()
        title_height = 60
        title_y = page_height - title_height
        c.setFillColorRGB(2 / 255, 101 / 255, 2 / 255) 
        c.rect(0, title_y, page_width, title_height, fill=True, stroke=False) 

        c.setFillColorRGB(245 / 255, 222 / 255, 179 / 255)
        c.setFont("Helvetica-Bold", 24)
        c.drawCentredString(page_width / 2, title_y + (title_height - 24) / 2, "Crop Disease Prediction Report")

        c.setFont("Helvetica", 12)
        c.setFillColorRGB(0, 0, 0) 
        y_offset = page_height - 100
        c.drawString(50, y_offset, f"Username: {username}")
        c.drawString(50, y_offset - 20, f"Prediction: {disease_name}")

        disease_probabilities = list(zip(disease_classes, probabilities))

        top_diseases = sorted(disease_probabilities, key=lambda x: x[1], reverse=True)[:10]

        table_data = [["Disease", "Probability"]]
        table_data += [[disease, f"{prob:.2%}"] for disease, prob in top_diseases]

        from reportlab.platypus import Table, TableStyle
        from reportlab.lib import colors

        table = Table(table_data, colWidths=[150, 100])
        table.setStyle(TableStyle([ 
            ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.black),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 10),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 6),
            ("BACKGROUND", (0, 1), (-1, -1), colors.whitesmoke),
            ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ]))

        table.wrapOn(c, 50, 50)
        table.drawOn(c, 50, page_height - 350)

        input_image_path = os.path.join(app.config['UPLOAD_FOLDER'], "input_temp.jpg")
        cv2.imwrite(input_image_path, cv2.cvtColor(img, cv2.COLOR_RGB2BGR))

        image_width, image_height = 200, 200
        c.drawImage(
            input_image_path,
            page_width - image_width - 50,
            page_height - 350,
            width=image_width,
            height=image_height,
        )

        prediction_date = datetime.now().strftime("%B %d, %Y") 
        c.setFont("Helvetica", 10)
        c.setFillColorRGB(0, 0, 0) 
        c.drawString(50, 30, f"Date: {prediction_date}")

        c.showPage()
        c.save()
        pdf_buffer.seek(0)
        pdf_data = pdf_buffer.read()

        conn = sqlite3.connect('reports.db')
        cursor = conn.cursor()
        cursor.execute(
            '''
            INSERT INTO reports (
                user_id, report_type, input_image, report_data, prediction, probabilities
            ) VALUES (?, ?, ?, ?, ?, ?)
            ''',
            (
                user_id,
                "Crop Disease",
                sqlite3.Binary(img.tobytes()),
                sqlite3.Binary(pdf_data),
                disease_name,
                str(probabilities)
            )
        )
        conn.commit()
        conn.close()

        return True, pdf_data, cursor.lastrowid
    except Exception as e:
        return False, str(e), None

@app.route('/crop-disease-predict', methods=['POST'])
def crop_disease_predict():
    try:
        if not request.files:
            logging.error("No files received.")
            return jsonify({"error": "No image received"}), 400

        file = request.files.get('image')
        if not file or not allowed_file(file.filename):
            logging.error("Invalid or missing image file.")
            return jsonify({"error": "Invalid or missing image file"}), 400

        user_details = request.form.get("user_details")
        if not user_details:
            logging.error("User details missing.")
            return jsonify({"error": "User details missing"}), 400

        user_details = json.loads(user_details)

        if not user_details.get("_id"):
            logging.error("User ID is missing.")
            return jsonify({"error": "User ID is missing"}), 400

        logging.info(f"User details: {user_details}")

        img = Image.open(file.stream)
        processed_image = preprocess_image(img)

        prediction = model.predict(processed_image)
        predicted_class_index = int(np.argmax(prediction, axis=1)[0])
        probabilities = prediction[0].tolist()
        disease_name = disease_classes[predicted_class_index]

        success, result, report_id = generate_and_store_report(
            user_id=user_details.get("_id"),
            username=user_details.get("name"),
            disease_name=disease_name,
            probabilities=probabilities,
            img=np.array(img)
        )

        if success:
            download_url =f"http://127.0.0.1:5001/download_report/{report_id}"
            return jsonify({
                "message": "Prediction successful",
                "prediction": disease_name,
                "report_id": report_id,
                "download_url": download_url
            }), 200

        return jsonify({"error": result}), 500

    except Exception as e:
        logging.error(f"Error processing request: {e}")
        return jsonify({"error": str(e)}), 500
  

@app.route('/reports', methods=['POST'])
def reports():
    try:
        data = request.get_json()
        if 'user_details' not in data:
            return jsonify({"error": "User details are required"}), 400

        user_details = data['user_details']
        user_id = user_details.get('_id')

        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
        
        connection = sqlite3.connect('reports.db') 
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()

        cursor.execute('SELECT id, report_type, created_at FROM reports WHERE user_id = ?', (user_id,))
        reports = cursor.fetchall()

        connection.close()
        
        reports_list = [{"id": report["id"],"type": report["report_type"],"date": report["created_at"]} for report in reports]
        return jsonify({"reports": reports_list})

    except Exception as e:
        print(f"Error fetching reports: {e}")
        return jsonify({"error": f"Error fetching reports: {e}"}), 500


@app.route('/delete_reports/<int:id>', methods=['DELETE'])
def delete_report(id):
    try:
        conn = sqlite3.connect('reports.db')
        cursor = conn.cursor()

        cursor.execute('DELETE FROM reports WHERE id = ?', (id,))
        conn.commit()
        conn.close()

        return jsonify({"message": "Report deleted successfully"}), 200
    except Exception as e:
        print(f"Error deleting report: {e}")
        return jsonify({"error": "Error deleting report"}), 500

@app.route('/download_report/<int:report_id>')
def download_report(report_id):
    try:
        conn = sqlite3.connect('reports.db')
        cursor = conn.cursor()

        cursor.execute('SELECT report_data FROM reports WHERE id = ?', (report_id,))
        report = cursor.fetchone()
        conn.close()

        if report:
            report_data = report[0] 

            if report_data:
                try:
                    pdf_bytes = BytesIO(report_data)
                    return send_file(pdf_bytes, as_attachment=True, download_name=f'report_{report_id}.pdf', mimetype='application/pdf')
                except Exception as e:
                    print(f"Error processing PDF: {str(e)}")
                    return jsonify({"error": "Error processing the report file"}), 500
            else:
                return jsonify({"error": "Report data is empty or corrupt"}), 500
        else:
            return jsonify({"error": "Report not found"}), 404

    except Exception as e:
        print(f"Error in download_report: {str(e)}")
        return jsonify({"error": f"Error fetching the report: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=False)
