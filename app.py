from flask import Flask, jsonify, request
from flask_cors import CORS
from script_function import Ask_AI
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})


@app.route('/api/data', methods=['GET'])
def get_data():
    prompt = request.args.get('prompt')
    #print(prompt)
    a=(Ask_AI(prompt))
    return jsonify(a)
'''
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
'''

if __name__ == '__main__':
    app.run(debug=True)