from datetime import timedelta
from flask import Flask, jsonify, request, render_template, session, g
from AskAI import Ask_AI
from trainAI import train_AI
from utilities.projectInfo import getprojectInfo
from utilities.IgnoreAI import IgnoreAI
from utilities.logger import UserLogger
from utilities.keyutils import set_key, delete_key, test_key, get_key
from utilities.rates import set_rates, get_rates
from utilities.clone_repo import get_clones, get_branches, select_branch
from utilities.repoutils import select_repo, list_repos, delete_repo
from utilities.cognito import get_user_attributes
from utilities.FilesToAnalyzedata import FilesToAnalyzedata
from syncAI import syncAI
import os, threading

application = Flask(__name__, static_folder='./10xdev/build/static', template_folder='./10xdev/build')
application.secret_key = os.urandom(24)
user_loggers = {}  # Dictionary to store UserLogger instances
 
@application.before_request
def before_request():
    session.permanent = True
    application.permanent_session_lifetime = timedelta(minutes=30)
    # Retrieve the Authorization header from the request
    auth_header = request.headers.get('Authorization')

    # Extract the code from the Authorization header (assuming it follows the "Bearer {code}" format)
    if auth_header and auth_header.startswith('Bearer '):
        code = auth_header.split(' ')[1]

        if code in session:
            email = session[code]
        else:
            email = get_user_attributes(code)
            if email is None:
                return render_template('index.html'), 401
            print("EMAIL: " + str(email))
            session[code] = email
            if not os.path.exists("../user/" + email):
                os.makedirs("../user/" + email)
                os.makedirs("../user/" + email + "/AIFiles")
                os.system("cp info.json " + "../user/" + email + "/AIFiles")
                os.system("cp AI.log " + "../user/" + email + "/AIFiles")

        g.email = email  # Save email in the 'g' object for later access

        if email not in user_loggers:
            user_loggers[email] = UserLogger(email)  # Create UserLogger instance for the user

        g.user_loggers = user_loggers

    return

@application.route('/', defaults={'path': ''})
@application.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')

@application.route('/api/projectInfo', methods=['GET'])
def get_projectInfo():
    email = getattr(g, 'email', None)
    return jsonify(getprojectInfo(email))


@application.route('/api/train', methods=['GET'])
def get_trainAI():
    email = getattr(g, 'email', None)
    user_loggers =  getattr(g, 'user_loggers', None)
    user_logger =  user_loggers[email]
    path = request.args.get('path')
    t = threading.Thread(target=train_AI, args=(path,user_logger,email))
    t.start()
    return jsonify('Training started'), 200


@application.route('/api/Repos', methods=['GET'])
def get_Repos():
    email = getattr(g, 'email', None)
    return jsonify(list_repos(email))


@application.route('/api/SelectRepo', methods=['GET'])
def select_Repos():
    email = getattr(g, 'email', None)
    return jsonify(select_repo(request.args.get('Directory'),email))


@application.route('/api/Repos/<path>', methods=['DELETE'])
def deleteRepo(path):
    email = getattr(g, 'email', None)
    response, code = delete_repo(path,email)
    return jsonify(response), code


@application.route('/api/sync', methods=['GET'])
def get_syncAI():
    email = getattr(g, 'email', None)
    user_logger = getattr(g, 'user_loggers', None)[email]
    sync_new_flag = request.args.get('sync_new')
    if sync_new_flag == 'true':
        message, files = syncAI(True, user_logger, email)

    else:
        message, files = syncAI(False, user_logger, email)
    return jsonify({"message": message, "files": files})


@application.route('/api/data', methods=['GET'])
def get_data():
    email = getattr(g, 'email', None)
    user_logger = getattr(g, 'user_loggers', None)[email]
    prompt = request.args.get('prompt')
    if prompt == "":
        return jsonify({"files": [], "response": "", "referenced_code": ""})

    response = Ask_AI(prompt, user_logger, email)

    return jsonify(
        {"files": response["files"], "response": response["response"], "referenced_code": response["referenced_code"]})


@application.route('/api/Ignore', methods=['GET'])
def get_AIIgnore():
    email = getattr(g, 'email', None)
    user_logger = getattr(g, 'user_loggers', None)[email]
    path = request.args.get('path')
    files2ignore, files2analyse = IgnoreAI(email,user_logger,path)
    print(len(files2analyse))
    return jsonify({"files2ignore": files2ignore, "files2analyze": files2analyse})

@application.route('/api/FilesToAnalyzedata', methods=['GET'])
def get_FilesToAnalyze():
    email = getattr(g, 'email', None)
    user_logger = getattr(g, 'user_loggers', None)[email]
    path = request.args.get('path')
    files2analyze = FilesToAnalyzedata(email,user_logger,path)
    return jsonify({"files2analyze": files2analyze})


@application.route('/api/saveFilesToIgnore', methods=['POST'])
def save_files_to_ignore():
    email = getattr(g, 'email', None)
    try:
        data = request.get_json()
        path = data['path']
        files_to_ignore = data['filesToIgnore']

        with open("../user/" + email + "/.AIIgnore"+path, "w") as f:
            for file in files_to_ignore:
                f.write(file + "\n")
        return {'message': 'Files to analyze saved successfully'}
    except Exception as e:
        # Handle any exceptions or errors
        return {'error': str(e)}, 500

@application.route('/api/CheckAIIgnore', methods=['GET'])
def get_CheckAIIgnore():
    email = getattr(g, 'email', None)
    path = request.args.get('path')
    if os.path.exists("../user/" + email + "/" +path + "/.AIIgnore"):
        return jsonify({"AIIgnore": True})
    else:
        return jsonify({"AIIgnore": False})


@application.route('/api/logs', methods=['GET'])
def get_logs():
    email = getattr(g, 'email', None)
    user_loggers = getattr(g, 'user_loggers', None)
    if email:
        # Assuming you have a dictionary of UserLogger instances, where the email is the key
        user_logger = user_loggers.get(email)
        if user_logger:
            logs = user_logger.get_last_logs()
            return jsonify(logs)
        else:
            return 'User Logger not found', 404
    else:
        return 'User email not found in session', 401

@application.route('/api/setKey', methods=['GET'])
def setkey():
    email = getattr(g, 'email', None)
    key = request.args.get('apikey')
    message, code = set_key(key, email)
    return jsonify({'message': message}), code


@application.route('/api/getKey', methods=['GET'])
def getkey():
    email = getattr(g, 'email', None)
    key = get_key(email)
    key = key.replace(key[5:15], "*" * 10)
    return jsonify(key)


@application.route('/api/deleteKey', methods=['GET'])
def deletekey():
    email = getattr(g, 'email', None)
    message, code = delete_key(email)
    return jsonify({'message': message}), code


@application.route('/api/testKey', methods=['GET'])
def testkey():
    email = getattr(g, 'email', None)
    key = request.args.get('apikey')
    message = test_key(key,email)
    return jsonify({'message': message}), 200


@application.route('/api/getRates', methods=['GET'])
def getRates():
    email = getattr(g, 'email', None)
    return jsonify(get_rates(email))


@application.route('/api/setRates', methods=['GET'])
def setRates():
    email = getattr(g, 'email', None)
    message, code = set_rates(request.args.get('rates'),email)
    return jsonify({'message': message}), code


@application.route('/api/clone', methods=['GET'])
def getClones():
    email = getattr(g, 'email', None)
    path = request.args.get('path')
    branches, code = get_clones(path,email)
    return jsonify(branches), code


@application.route('/api/setBranch', methods=['GET'])
def set_branch():
    email = getattr(g, 'email', None)
    path = request.args.get('path')
    branch = request.args.get('branch')
    select_branch(path, branch, email)
    return jsonify({'message': 'Success'})

@application.route('/api/branches', methods=['GET'])
def getBranches():
    email = getattr(g, 'email', None)
    path = request.args.get('path')
    branches, code = get_branches(path,email)
    return jsonify(branches), code

@application.route('/api/login', methods=['GET'])
def login():
    return jsonify({'loggedIn': True, 'message': 'Logged In'}), 200


if __name__ == '__main__':
    application.run(debug=True, port=8000)
