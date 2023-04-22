from flask import Flask, jsonify, request
from flask_cors import CORS
from AskAI import Ask_AI
from trainAI import train_AI
from utilities.projectInfo import getprojectInfo
from syncAI import syncAI
import csv

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

@app.route('/api/projectInfo', methods=['GET'])
def get_projectInfo():
    print("Checking Branch")
    return jsonify("Hi")

@app.route('/api/setup', methods=['POST'])
def get_trainAI():
    data = request.get_json()
    path = data.get('path')
    print("Training AI")
    a=(train_AI(path))
    return jsonify(a)

@app.route('/api/sync', methods=['GET'])
def get_syncAI():
    print("Syncing AI")
    syncAI()
    a=("SYNC COMPLETE")
    return jsonify(a)

@app.route('/api/data', methods=['GET'])
def get_data():
    prompt = request.args.get('prompt')
    print("Asking AI")
    a=("Hi hello from server"+prompt)
    return jsonify(a)


if __name__ == '__main__':
    app.run(debug=True)


