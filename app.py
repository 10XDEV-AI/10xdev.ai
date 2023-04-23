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
    return jsonify(getprojectInfo())

@app.route('/api/setup', methods=['GET'])
def get_trainAI():
    path = request.args.get('path')
    print("Training AI")
    a = train_AI(path)
    return jsonify(a)


@app.route('/api/sync', methods=['GET'])
def get_syncAI():
    syncAI()
    a=("SYNC COMPLETE")
    return jsonify(a)

@app.route('/api/data', methods=['GET'])
def get_data():
    prompt = request.args.get('prompt')
    print("Asking AI")
    response = Ask_AI(prompt)
    print(response)
    print(response["files"])
    #print(type(response["files"]))
    return jsonify({"files": response["files"], "response": response["response"]})


if __name__ == '__main__':
    app.run(debug=True)


