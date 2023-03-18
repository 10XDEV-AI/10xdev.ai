from flask import Flask, jsonify, request
from flask_cors import CORS
from script_function import Ask_AI
from trainAI import train_AI
from projectInfo import getprojectInfo
import csv
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

def write_path_to_csv(path):
    with open('info.csv', 'a') as file:
        writer = csv.writer(file)
        writer.writerow([path])

@app.route('/api/projectInfo', methods=['GET'])
def get_projectInfo():
    print("Checking Branch")
    return jsonify(getprojectInfo())

@app.route('/api/data', methods=['GET'])
def get_data():
    prompt = request.args.get('prompt')
    print("Asking AI")
    a=(Ask_AI(prompt))
    return jsonify(a)

@app.route('/api/setup', methods=['POST'])
def get_trainAI():
    data = request.get_json()
    path = data.get('path')
    write_path_to_csv(path)
    print("Training AI")
    a=(train_AI(path))
    return jsonify(a)

if __name__ == '__main__':
    app.run(debug=True)