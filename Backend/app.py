from flask import Flask, request, jsonify
import json
import os
from flask_cors import CORS

app = Flask(__name__)

# Allow all origins for CORS, you can also restrict to specific origins
CORS(app, origins=["http://localhost:3000"], methods=["GET", "POST", "OPTIONS"])

DATA_FILE = os.path.join(os.path.dirname(__file__), 'data.json')

@app.route('/')
def hellow():
    return "Welcome to the API. To view data, use the /api endpoint."

@app.route('/api', methods=['GET'])
def get_data():
    try:
        if not os.path.exists(DATA_FILE):
            return jsonify([])

        with open(DATA_FILE, 'r') as file:
            data = json.load(file)
            return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/submit', methods=['POST'])
def submit_data():
    try:
        if request.is_json:
            new_data = request.get_json()
        else:
            new_data = {
                "id": request.form.get("id"),
                "name": request.form.get("name")
            }

        if not os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'w') as f:
                json.dump([], f)

        with open(DATA_FILE, 'r') as file:
            data = json.load(file)

        data.append(new_data)

        with open(DATA_FILE, 'w') as file:
            json.dump(data, file, indent=4)

        return jsonify({"message": "Data added successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
