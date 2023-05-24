from flask import Flask, jsonify, request, render_template
from AskAI import Ask_AI
from trainAI import train_AI
from utilities.projectInfo import getprojectInfo
from utilities.IgnoreAI import IgnoreAI
from utilities.logger import get_last_logs,log
from utilities.keyutils import set_key, delete_key, test_key, get_key
from utilities.rates import set_rates, get_rates
from utilities.clone_repo import get_clones, get_branches, select_branch
from utilities.repoutils import select_repo, list_repos, delete_repo
from utilities.cognito import get_user_attributes
from syncAI import syncAI
import os, threading, time

application = Flask(__name__, static_folder='./10xdev/build/static', template_folder='./10xdev/build')
last_ask_time = 0

@application.route('/')
def index():
    return render_template('index.html')


@application.route('/api/projectInfo', methods=['GET'])
def get_projectInfo():
    return jsonify(getprojectInfo())


@application.route('/api/train', methods=['GET'])
def get_trainAI():
    path = request.args.get('path')
    t = threading.Thread(target=train_AI, args=(path,))
    t.start()
    return jsonify('Training started'), 200


@application.route('/api/Repos', methods=['GET'])
def get_Repos():
    return jsonify(list_repos())


@application.route('/api/SelectRepo', methods=['GET'])
def select_Repos():
    return select_repo(request.args.get('Full_Path'))


@application.route('/api/Repos/<path>', methods=['DELETE'])
def deleteRepo(path):
    response, code = delete_repo(path)
    return jsonify(response), code


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
    if prompt == "":
        return jsonify({"files": [], "response": "", "referenced_code": ""})

    global last_ask_time
    if time.time() - last_ask_time < 60/int(get_rates().split(",")[0]):
        log("Please wait for " + str(round(int(get_rates().split(",")[0]) - (time.time() - last_ask_time))) + " seconds")
        log("Your request has been queued because of rate limits")
        log("Get a paid openAI account to increase your rate limits")
        time.sleep(60/int(get_rates().split(",")[0])+1 - (time.time() - last_ask_time))

    response = Ask_AI(prompt)
    last_ask_time = time.time()
    return jsonify(
        {"files": response["files"], "response": response["response"], "referenced_code": response["referenced_code"]})


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
    branches, code = get_clones(path)
    return jsonify(branches), code


@application.route('/api/setBranch', methods=['GET'])
def set_branch():
    path = request.args.get('path')
    branch = request.args.get('branch')
    select_branch(path, branch)
    return jsonify({'message': 'Success'})

@application.route('/api/branches', methods=['GET'])
def getBranches():
    path = request.args.get('path')
    branches, code = get_branches(path)
    return jsonify(branches), code

@application.route('/api/userinfo', methods=['GET'])
def get_user():
    # Retrieve the Authorization header from the request
    auth_header = request.headers.get('Authorization')

    # Extract the code from the Authorization header (assuming it follows the "Bearer {code}" format)
    if auth_header and auth_header.startswith('Bearer '):
        code = auth_header.split(' ')[1]

        print(get_user_attributes(code))

    return jsonify({'message': 'hi'}), 200


if __name__ == '__main__':
    application.run(debug=True, port=8000)
