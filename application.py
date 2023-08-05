from datetime import timedelta
from flask import Flask, jsonify, request, render_template, session, g
from AskAI import Ask_AI_search_files, Ask_AI_with_referenced_files
from trainAI import train_AI
from utilities.projectInfo import getprojectInfo
from utilities.IgnoreAI import IgnoreAI
from utilities.logger import UserLogger
from utilities.keyutils import set_key, delete_key, test_key, get_key
from utilities.rates import set_rates, get_rates
from utilities.clone_repo import get_clones, get_branches, select_branch, get_private_clones
from utilities.repoutils import select_repo, list_repos, delete_repo
from utilities.cognito import get_user_attributes
from utilities.FilesToAnalyzedata import FilesToAnalyzedata
from utilities.mixpanel import track_event
from syncAI import syncAI
import os, threading
import requests



application = Flask(
    __name__, static_folder="./10xdev/build/static", template_folder="./10xdev/build"
)
application.secret_key = os.urandom(24)
user_loggers = {}


@application.before_request
def before_request():
    session.permanent = True
    application.permanent_session_lifetime = timedelta(minutes=720)
    # Retrieve the Authorization header from the request
    auth_header = request.headers.get("Authorization")

    # Extract the code from the Authorization header (assuming it follows the "Bearer {code}" format)
    if auth_header and auth_header.startswith("Bearer "):
        code = auth_header.split(" ")[1]

        if code in session:
            email = session[code]
        else:
            email = get_user_attributes(code)
            if email is None:
                return render_template("index.html"), 401
            print("EMAIL: " + str(email))
            session[code] = email
            if not os.path.exists("../user/" + email):
                os.makedirs("../user/" + email)
                os.makedirs("../user/" + email + "/AIFiles")
                os.system("cp info.json " + "../user/" + email + "/AIFiles")
                os.system("cp AI.log " + "../user/" + email + "/AIFiles")

        g.email = email  # Save email in the 'g' object for later access

        if email not in user_loggers:
            user_loggers[email] = UserLogger(
                email
            )  # Create UserLogger instance for the user

        g.user_loggers = user_loggers

    return


@application.route("/", defaults={"path": ""})
@application.route("/<path:path>")
def catch_all(path):
    return render_template("index.html")


@application.route("/api/projectInfo", methods=["GET"])
def get_projectInfo():
    email = getattr(g, "email", None)
    return jsonify(getprojectInfo(email))


@application.route("/api/train", methods=["GET"])
def get_trainAI():
    email = getattr(g, "email", None)
    user_loggers = getattr(g, "user_loggers", None)
    user_logger = user_loggers[email]
    path = request.args.get("path")
    t = threading.Thread(target=train_AI, args=(path, user_logger, email))
    t.start()
    return jsonify("Training started"), 200


@application.route("/api/Repos", methods=["GET"])
def get_Repos():
    email = getattr(g, "email", None)
    return jsonify(list_repos(email))


@application.route("/api/SelectRepo", methods=["GET"])
def select_Repos():
    email = getattr(g, "email", None)
    return jsonify(select_repo(request.args.get("Directory"), email))


@application.route("/api/Repos/<path>", methods=["DELETE"])
def deleteRepo(path):
    email = getattr(g, "email", None)
    response, code = delete_repo(path, email)
    return jsonify(response), code


@application.route("/api/sync", methods=["GET"])
def get_syncAI():
    email = getattr(g, "email", None)
    user_logger = getattr(g, "user_loggers", None)[email]
    sync_new_flag = request.args.get("sync_new")
    if sync_new_flag == "true":
        message, files = syncAI(True, user_logger, email)

    else:
        message, files = syncAI(False, user_logger, email)
    return jsonify({"message": message, "files": files})


@application.route("/api/data", methods=["POST", "GET"])
def get_data():
    email = getattr(g, "email", None)
    user_logger = getattr(g, "user_loggers", None)[email]
    scope = request.json.get("checkedFiles")
    prompt = request.json.get("prompt")
    chat_messages = request.json.get("chatMessages")
    referenced_files = Ask_AI_search_files(prompt, user_logger, email, chat_messages, scope)["files"]
    response = Ask_AI_with_referenced_files(prompt, user_logger, email, chat_messages, referenced_files)
    return jsonify(
        {
            "files": response["files"],
            "response": response["response"],
            "referenced_code": response["referenced_code"],
        }
    )

@application.route("/api/search_files", methods=["POST"])
def search_files_api():
    email = getattr(g, "email", None)
    user_logger = getattr(g, "user_loggers", None)[email]
    scope = request.json.get("checkedFiles")
    prompt = request.json.get("prompt")
    chat_messages = request.json.get("chatMessages")
    response = Ask_AI_search_files(prompt, user_logger, email, chat_messages, scope)

    return jsonify(response)

@application.route("/api/get_response", methods=["POST"])
def get_response_api():
    email = getattr(g, "email", None)
    user_logger = getattr(g, "user_loggers", None)[email]
    prompt = request.json.get("prompt")
    chat_messages = request.json.get("chatMessages")
    referenced_files = request.json.get("files")
    response = Ask_AI_with_referenced_files(prompt, user_logger, email, chat_messages, referenced_files)
    return jsonify(response)

@application.route("/api/Ignore", methods=["GET"])
def get_AIIgnore():
    email = getattr(g, "email", None)
    user_logger = getattr(g, "user_loggers", None)[email]
    path = request.args.get("path")
    files2ignore, files2analyse = IgnoreAI(email, user_logger, path)
    print(len(files2analyse))
    return jsonify({"files2ignore": files2ignore, "files2analyze": files2analyse})


@application.route("/api/Treedata", methods=["GET"])
def get_FilesToAnalyze():
    email = getattr(g, "email", None)
    user_logger = getattr(g, "user_loggers", None)[email]
    path = request.args.get("path")
    files2ignore, files2analyse = FilesToAnalyzedata(email, user_logger, path)
    return jsonify({"files2ignore": files2ignore, "files2analyze": files2analyse})


@application.route("/api/saveFilesToIgnore", methods=["POST"])
def save_files_to_ignore():
    email = getattr(g, "email", None)
    try:
        data = request.get_json()
        path = data["path"]
        files_to_ignore = data["filesToIgnore"]

        with open("../user/" + email + "/.AIIgnore" + path, "w") as f:
            for file in files_to_ignore:
                f.write(file + "\n")
        return {"message": "Files to analyze saved successfully"}
    except Exception as e:
        # Handle any exceptions or errors
        return {"error": str(e)}, 500


@application.route("/api/CheckAIIgnore", methods=["GET"])
def get_CheckAIIgnore():
    email = getattr(g, "email", None)
    path = request.args.get("path")
    if os.path.exists("../user/" + email + "/" + path + "/.AIIgnore"):
        return jsonify({"AIIgnore": True})
    else:
        return jsonify({"AIIgnore": False})


@application.route("/api/logs", methods=["GET"])
def get_logs():
    email = getattr(g, "email", None)
    user_loggers = getattr(g, "user_loggers", None)
    if email:
        # Assuming you have a dictionary of UserLogger instances, where the email is the key
        user_logger = user_loggers.get(email)
        if user_logger:
            logs = user_logger.get_last_logs()
            return jsonify(logs)
        else:
            return "User Logger not found", 404
    else:
        return "User email not found in session", 401


@application.route("/api/setKey", methods=["GET"])
def setkey():
    email = getattr(g, "email", None)
    key = request.args.get("apikey")
    message, code = set_key(key, email)
    return jsonify({"message": message}), code


@application.route("/api/getKey", methods=["GET"])
def getkey():
    email = getattr(g, "email", None)
    key = get_key(email)
    if key.strip() != "":
        key = key.replace(key[5:45], "*" * 40)
    return jsonify(key)


@application.route("/api/deleteKey", methods=["GET"])
def deletekey():
    email = getattr(g, "email", None)
    message, code = delete_key(email)
    return jsonify({"message": message}), code


@application.route("/api/testKey", methods=["GET"])
def testkey():
    email = getattr(g, "email", None)
    key = request.args.get("apikey")
    message = test_key(key, email)
    return jsonify({"message": message}), 200


@application.route("/api/getRates", methods=["GET"])
def getRates():
    email = getattr(g, "email", None)
    return jsonify(get_rates(email))


@application.route("/api/setRates", methods=["GET"])
def setRates():
    email = getattr(g, "email", None)
    message, code = set_rates(request.args.get("rates"), email)
    return jsonify({"message": message}), code

from flask import request, jsonify, g

@application.route("/api/clone", methods=["GET"])
def getClones():
    email = getattr(g, "email", None)
    path = request.args.get("path")
    # Check if the path ends with ".git"
    if not path.endswith(".git"):
        path += ".git"
    branches, code = get_clones(path, email)
    return jsonify(branches), code


@application.route("/api/clone-private", methods=["GET"])
def getPrivateClones():
    email = getattr(g, "email", None)
    path = request.args.get("path")
    access_token = request.args.get("access_token")
    branches, code = get_private_clones(path, email, access_token)
    return jsonify(branches), code


@application.route("/api/setBranch", methods=["GET"])
def set_branch():
    email = getattr(g, "email", None)
    path = request.args.get("path")
    branch = request.args.get("branch")
    select_branch(path, branch, email)
    return jsonify({"message": "Success"})


@application.route("/api/branches", methods=["GET"])
def getBranches():
    email = getattr(g, "email", None)
    path = request.args.get("path")
    branches, code = get_branches(path, email)
    return jsonify(branches), code


@application.route("/api/login", methods=["GET"])
def login():
    email = getattr(g, "email", None)
    try:
        if not os.path.exists("../user/" + email):
            os.makedirs("../user/" + email)
        if not  os.path.exists("../user/" + email+"/AIFiles"):
            os.makedirs("../user/" + email + "/AIFiles")
        if not os.path.exists("../user/" + email +"/AIFiles/info.json"):
            os.system("cp info.json " + "../user/" + email + "/AIFiles")
        if not os.path.exists("../user/" + email +"/AIFiles/info.json"):
            os.system("cp AI.log " + "../user/" + email + "/AIFiles")

        track_event('login', {'email': email})
        return jsonify({"loggedIn": True, "message": "Logged In"}), 200
    except:
        return jsonify({"loggedIn": False, "message": "Some issues occured"})


@application.route("/api/github", methods=["GET"])
def github_api():
    code = request.args.get("code")
    client_id = request.args.get("client_id")
    if client_id == "eaae8a43278892ed15e1":
        client_secret = "613f61d82e9dae784ee76bb85dbf11eaf24d2766"
    elif client_id == "7de77ae768aa62b79e09":
        client_secret = "bb481efea8c764dd02af801d783ff61f3954b43d"
    elif  client_id == "40acda1a937125d9193b":
        client_secret = "d5f903e15c64c6ffb7fbf011fac15045cc2f0758"
    else:
        return jsonify({"error": "Invalid client_id"}), 400

    params = '?client_id=' + client_id + '&client_secret=' + client_secret + '&code=' + code
    response = requests.post(
        'https://github.com/login/oauth/access_token' + params,
        headers={'Accept': 'application/json'}
    )
    return jsonify(response.json())

@application.route("/api/github/getuser", methods=["GET"])
def get_user():
    access_token = request.args.get('access_token')
    headers = {'Authorization': f'token {access_token}'}
    response = requests.get('https://api.github.com/user', headers=headers)

    if response.status_code == 200:
        try:
            user_data = response.json()
            return jsonify(user_data)
        except ValueError:
            return jsonify({'error': 'Failed to parse JSON response'})
    else:
        return jsonify({'error': 'Failed to retrieve user data'})

@application.route("/api/github/getallrepos", methods=["GET"])
def get_alluserrepos():
    access_token = request.args.get('access_token')
    headers = {'Authorization': f'token {access_token}'}
    params={'visibility': 'all','per_page': 1000}
    response = requests.get('https://api.github.com/user/repos', headers=headers, params=params)
    
    if response.status_code == 200:
        try:
            user_data = response.json()
            return jsonify(user_data)
        except ValueError:
            return jsonify({'error': 'Failed to parse JSON response'})
if __name__ == "__main__":
    application.run(debug=True, port=8000)
