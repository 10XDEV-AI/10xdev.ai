from flask import Flask, jsonify, request
from flask_cors import CORS
from script_function import Ask_AI
from projectInfo import getprojectInfo
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})


@app.route('/api/projectInfo', methods=['GET'])
def get_projectInfo():
    print("Checking Branch")
    return jsonify(getprojectInfo())

@app.route('/api/data', methods=['GET'])
def get_data():
    prompt = request.args.get('path')
    print("Training AI")
    return jsonify(a)

@app.route('/api/setup', methods=['GET'])
def get_projectInfo():
    prompt = request.args.get('prompt')
    print("Asking AI")
    a=(Ask_AI(prompt))
    return jsonify(a)


if __name__ == '__main__':
    app.run(debug=True)