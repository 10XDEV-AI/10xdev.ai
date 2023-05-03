from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from AskAI import Ask_AI
from trainAI import train_AI
from utilities.projectInfo import getprojectInfo
from utilities.IgnoreAI import IgnoreAI
from utilities.logger import get_last_logs
from utilities.keyutils import set_key, delete_key, test_key,get_key
from utilities.rates import set_rates, get_rates
from syncAI import syncAI
import os, subprocess, shutil, json

app = Flask(__name__, static_folder='10xdev/build/static', template_folder='10xdev/build')
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})


@app.route('/')
def index():
    return render_template('index.html')


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
    with open(os.path.join('AIFiles', 'info.json'), 'r') as f:
        info = json.load(f)

    directories = []
    extra_directories = []

    info_repos = info['repos']

    for repo in info_repos:
        repo_name = repo.split('/')[-1]

        if os.path.exists(os.path.join('AIFiles', repo_name)):
            output = subprocess.check_output(['git', 'rev-parse', '--abbrev-ref', 'HEAD'], cwd=repo)
            branch_name = output.decode('utf-8').strip()
            directories.append({"Directory": repo_name, "AIIgnore": True, "Branch": branch_name, "Full_Path": repo})
        else:
            extra_directories.append(repo)

    for repo in extra_directories:
        info_repos.remove(repo)
        if info['current_repo'] == repo:
            info['current_repo'] = "Test"

    info['repos'] = info_repos

    with open(os.path.join('AIFiles', 'info.json'), 'w') as f:
        json.dump(info, f)

    return jsonify(directories)


@app.route('/api/SelectRepo', methods=['GET'])
def select_Repos():
    Full_Path = request.args.get('Full_Path')
    try:
        with open(os.path.join('AIFiles', 'info.json'), 'r') as f:
            info = json.load(f)
            info['current_repo'] = Full_Path
        with open(os.path.join('AIFiles', 'info.json'), 'w') as f:
            json.dump(info, f)
        return 'Success'
    except Exception as e:
        return f'Error: {e}'


@app.route('/api/Repos/<Full_path>', methods=['DELETE'])
def delete_repo(Full_path):
    if Full_path is None or Full_path.strip() == "":
        return jsonify({"message": "Invalid directory name."}), 400
    repo_name = Full_path.split('/')[-1]
    repo_path = os.path.join('AIFiles', repo_name)
    if os.path.exists(repo_path):
        shutil.rmtree(repo_path)

        # Delete fs file

        filename = "AIFiles/" "fs_" + repo_path.split('/')[-1] + ".csv"
        if os.path.exists(filename):
            os.remove(filename)

        with open('AIFiles/info.json', 'r') as f:
            info = json.load(f)
            repos = info['repos']
            if Full_path in repos:
                repos.remove(Full_path)
                info['current_repo'] = "Test"
            else:
                return jsonify({"message": f"{repo_name} does not exist in the list of repositories."}), 404

        with open('AIFiles/info.json', 'w') as f:
            json.dump(info, f)

        return jsonify({"message": f"{repo_name} has been deleted."}), 200
    else:
        return jsonify({"message": f"{repo_name} does not exist."}), 404


@app.route('/api/sync', methods=['GET'])
def get_syncAI():
    sync_new_flag = request.args.get('sync_new')
    if sync_new_flag == 'true':
        message, files = syncAI(True)

    else:
        message, files = syncAI(False)
    return jsonify({"message": message, "files": files})


@app.route('/api/data', methods=['GET'])
def get_data():
    prompt = request.args.get('prompt')
    print("Asking AI")
    response = Ask_AI(prompt)
    return jsonify({"files": response["files"], "response": response["response"]})


@app.route('/api/Ignore', methods=['GET'])
def get_AIIgnore():
    path = request.args.get('path')
    files2ignore, files2analyze = IgnoreAI(path)
    return jsonify({"files2ignore": files2ignore, "files2analyze": files2analyze})


@app.route('/api/CheckAIIgnore', methods=['GET'])
def get_CheckAIIgnore():
    path = request.args.get('path')
    if os.path.exists(path + "/.AIIgnore"):
        return jsonify({"AIIgnore": True})
    else:
        return jsonify({"AIIgnore": False})


@app.route('/api/logs', methods=['GET'])
def get_logs():
    return jsonify(get_last_logs())


@app.route('/api/setKey', methods=['GET'])
def setkey():
    key = request.args.get('apikey')
    message, code = set_key(key)
    return jsonify({'message': message}), code


@app.route('/api/getKey', methods=['GET'])
def getkey():
    return jsonify(get_key())


@app.route('/api/deleteKey', methods=['GET'])
def deletekey():
    message, code = delete_key()
    return jsonify({'message': message}), code


@app.route('/api/testKey', methods=['GET'])
def testkey():
    key = request.args.get('apikey')
    message, code = test_key(key)
    return jsonify({'message': message}), code

@app.route('/api/getRates', methods=['GET'])
def getRates():
    return jsonify(get_rates())


@app.route('/api/setRates', methods=['GET'])
def setRates():
    message, code = set_rates(request.args.get('rates'))
    return jsonify({'message': message}), code

if __name__ == '__main__':
    app.run(debug=True)
