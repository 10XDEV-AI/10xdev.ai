from flask import Flask, jsonify, request
from flask_cors import CORS
from script_function import Ask_AI
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})


@app.route('/api/data', methods=['GET'])
def get_data():
    prompt = request.args.get('prompt')
    print(prompt)
    a=(Ask_AI(prompt))
    print(a)
    print(type(a))
    print(jsonify(a))
    print(type(jsonify(a)))
    return jsonify(a)

if __name__ == '__main__':
    app.run(debug=True)