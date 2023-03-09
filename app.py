
from flask import Flask, jsonify, request
from flask_cors import CORS
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

@app.route('/')
def index():
    return 'Hello, World!'

@app.route('/api/data', methods=['GET'])
def get_data():
    city = request.args.get('city')
    data = [
        {
            'name': 'John',
            'age': 30,
            'city': 'New York'
        },
        {
            'name': 'Jane',
            'age': 25,
            'city': 'Boston'
        },
        {
            'name': 'Joe',
            'age': 40,
            'city': 'Chicago'
        }
    ]

    for item in data:
        if item['city'] == city:
            return jsonify(item)

    return jsonify({'error': 'City not found'})

if __name__ == '__main__':
    app.run(debug=True)