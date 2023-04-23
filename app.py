from flask import Flask, jsonify, request
from flask_cors import CORS
from AskAI import Ask_AI
from trainAI import train_AI
from utilities.projectInfo import getprojectInfo
from utilities.IgnoreAI import IgnoreAI
from syncAI import syncAI
import csv,os,subprocess,shutil,json
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

@app.route('/api/projectInfo', methods=['GET'])
def get_projectInfo():
    return jsonify(getprojectInfo())

@app.route('/api/train', methods=['GET'])
def get_trainAI():
    path = request.args.get('path')
    print("Training AI")
    a = train_AI(path)
    return jsonify(a)

@app.route('/api/Repos', methods=['GET'])
def get_Repos():
    # List all repositories in AIFiles folder
    directories = []

    for entry in os.scandir('AIFiles'):
        if entry.is_dir():
            #check for .AIIgnore
            if os.path.exists(entry.path+"/.AIIgnore"):
                output = subprocess.check_output(['git', 'rev-parse', '--abbrev-ref', 'HEAD'], cwd=entry.path)
                branch_name = output.decode('utf-8').strip()
                directories.append({"Directory": entry.name, "AIIgnore": True, "Branch": branch_name})

    print(directories)
    return jsonify(directories)

@app.route('/api/Repos/<directory>', methods=['DELETE'])
def delete_repo(directory):
    if directory is None or directory.strip() == "":
        return jsonify({"message": "Invalid directory name."}), 400

    repo_path = os.path.join('AIFiles', directory)
    if os.path.exists(repo_path):
        shutil.rmtree(repo_path)

        # Delete fs file

        filename  = "AIFiles/" "fs_"+repo_path.split('/')[-1]+".csv"
        if os.path.exists(filename):
            os.remove(filename)

        with open('AIFiles/info.json', 'r') as f:
            info = json.load(f)
            repos = info['repos']
            if directory in repos:
                repos.remove(directory)
            else:
                return jsonify({"message": f"{directory} does not exist in the list of repositories."}), 404

        data['current_repo'] = "Test"
        with open('AIFiles/info.json', 'w') as f:
            json.dump(info, f)

        return jsonify({"message": f"{directory} has been deleted."}), 200
    else:
        return jsonify({"message": f"{directory} does not exist."}), 404


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
    return jsonify({"files": response["files"], "response": response["response"]})

@app.route('/api/Ignore', methods=['GET'])
def get_AIIgnore():
    path = request.args.get('path')
    files2ignore,files2analyze = IgnoreAI(path)
    return jsonify({"files2ignore": files2ignore, "files2analyze": files2analyze})

@app.route('/api/CheckAIIgnore', methods=['GET'])
def get_CheckAIIgnore():
    path = request.args.get('path')
    if os.path.exists(path+"/.AIIgnore"):
        return jsonify({"AIIgnore": True})
    else:
        return jsonify({"AIIgnore": False})

if __name__ == '__main__':
    app.run(debug=True)


