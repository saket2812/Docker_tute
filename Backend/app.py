from flask import Flask, request, jsonify
import json
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
DATA_FILE = 'data.json'

@app.route('/')
def hellow():
    return "Welcome to the API. To view data, use the /api endpoint."

# GET endpoint to return all data
@app.route('/api', methods=['GET'])
def get_data():
    try:
        if not os.path.exists(DATA_FILE):
            return jsonify([])  # Return empty list if file not found

        with open(DATA_FILE, 'r') as file:
            data = json.load(file)
            return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# POST endpoint to accept new item
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

        with open('data.json', 'r') as file:
            data = json.load(file)

        data.append(new_data)

        with open('data.json', 'w') as file:
            json.dump(data, file, indent=4)

        return jsonify({"message": "Data added successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
