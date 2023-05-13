from flask import Flask, jsonify, request, render_template
from AskAI import Ask_AI
from trainAI import train_AI
from utilities.projectInfo import getprojectInfo
from utilities.IgnoreAI import IgnoreAI
from utilities.logger import get_last_logs
from utilities.keyutils import set_key, delete_key, test_key,get_key
from utilities.rates import set_rates, get_rates
from utilities.clone_repo import get_clones,select_branch
from syncAI import syncAI
import os, subprocess, shutil, json, openai

application = Flask(__name__, static_folder='./10xdev/build/static', template_folder='./10xdev/build')


@application.route('/')
def index():
    return render_template('index.html')


@application.route('/api/projectInfo', methods=['GET'])
def get_projectInfo():
    return jsonify(getprojectInfo())


@application.route('/api/train', methods=['GET'])
def get_trainAI():
    path = request.args.get('path')
    print("Training AI")
    a = train_AI(path)
    return jsonify(a)


@application.route('/api/Repos', methods=['GET'])
def get_Repos():
    with open(os.path.join('AIFiles', 'info.json'), 'r') as f:
        info = json.load(f)

    directories = []

    info_repos = info['repos']

    print(info_repos)
    if len(info_repos) != 0:
        for repo in info_repos:
            print(repo)
            repo_name = repo.split('/')[-1]
            if os.path.exists(os.path.join('AIFiles', repo_name)):
                output = subprocess.check_output(['git', 'symbolic-ref', '--short', 'HEAD'], cwd=repo_name)
                branch_name = output.decode('utf-8').strip()
                directories.append({"Directory": repo_name, "Trained": True, "Branch": branch_name, "Full_Path": repo})
            else:
                try:
                    output = subprocess.check_output(['git', 'symbolic-ref', '--short', 'HEAD'], cwd=repo)
                    branch_name = output.decode('utf-8').strip()
                    directories.append({"Directory": repo_name, "Trained": False, "Branch": branch_name, "Full_Path": repo})
                except subprocess.CalledProcessError as e:
                    print(f"Error: {e}")
                    # Handle the exception here, for example:

    return jsonify(directories)


@application.route('/api/SelectRepo', methods=['GET'])
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


@application.route('/api/Repos/<Full_path>', methods=['DELETE'])
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


@application.route('/api/sync', methods=['GET'])
def get_syncAI():
    sync_new_flag = request.args.get('sync_new')
    if sync_new_flag == 'true':
        message, files = syncAI(True)

    else:
        message, files = syncAI(False)
    return jsonify({"message": message, "files": files})


@application.route('/api/data', methods=['GET'])
def get_data():
    prompt = request.args.get('prompt')
    response = Ask_AI(prompt)
    return jsonify({"files": response["files"], "response": response["response"]})


@application.route('/api/Ignore', methods=['GET'])
def get_AIIgnore():
    path = request.args.get('path')
    files2ignore, files2analyze = IgnoreAI(path)
    return jsonify({"files2ignore": files2ignore, "files2analyze": files2analyze})


@application.route('/api/CheckAIIgnore', methods=['GET'])
def get_CheckAIIgnore():
    path = request.args.get('path')
    if os.path.exists(path + "/.AIIgnore"):
        return jsonify({"AIIgnore": True})
    else:
        return jsonify({"AIIgnore": False})


@application.route('/api/logs', methods=['GET'])
def get_logs():
    return jsonify(get_last_logs())


@application.route('/api/setKey', methods=['GET'])
def setkey():
    key = request.args.get('apikey')
    openai.api_key = key
    message, code = set_key(key)
    return jsonify({'message': message}), code


@application.route('/api/getKey', methods=['GET'])
def getkey():
    return jsonify(get_key())


@application.route('/api/deleteKey', methods=['GET'])
def deletekey():
    message, code = delete_key()
    return jsonify({'message': message}), code


@application.route('/api/testKey', methods=['GET'])
def testkey():
    key = request.args.get('apikey')
    message, code = test_key(key)
    return jsonify({'message': message}), code

@application.route('/api/getRates', methods=['GET'])
def getRates():
    return jsonify(get_rates())


@application.route('/api/setRates', methods=['GET'])
def setRates():
    message, code = set_rates(request.args.get('rates'))
    return jsonify({'message': message}), code


@application.route('/api/clone', methods=['GET'])
def getClones():
    path = request.args.get('path')
    branches,code = get_clones(path)
    return jsonify(branches),code

@application.route('/api/setBranch', methods=['GET'])
def set_branch():
    path = request.args.get('path')
    branch = request.args.get('branch')
    select_branch(path,branch)
    return jsonify({'message': 'Success'})

if __name__ == '__main__':
    application.run(debug=True, port=8000)
