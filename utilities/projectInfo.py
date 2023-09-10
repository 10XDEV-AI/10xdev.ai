import os
import subprocess
import simplejson as json
from datetime import datetime
import humanize

def get_time_difference_str(last_commit_time):
    current_datetime = datetime.now()
    time_difference = current_datetime - last_commit_time
    return humanize.naturaldelta(time_difference) + " ago"

def get_last_commit_time(repo_path):
    output = subprocess.check_output(['git', 'log', '-1', '--format=%ct'], cwd=repo_path)
    last_commit_time = int(output.decode('utf-8').strip())
    return last_commit_time


def getprojectInfo(email, repo_name=True, branch_name=True, full_path=False):
    # Open info.json and read the path
    with open(os.path.join("../user", email, 'AIFiles', 'info.json'), 'r') as f:
        data = json.load(f)

    if data['current_repo'] == "" or data['current_repo'] == None:
        return {"repo_name": "No Repos selected", "branch_name": "No branch selected"}

    repo_path = "../user/"+email+"/"+data['current_repo']
    repo_name = repo_path.split('/')[-1]

    # Check the current branch of the repo
    if os.path.exists(os.path.join(repo_path, '.git')):
        output = subprocess.check_output(['git', 'symbolic-ref', '--short', 'HEAD'], cwd=repo_path)
        branch_name = output.decode('utf-8').strip()
        latest_commit = subprocess.check_output(['git', 'rev-parse', '--short', 'HEAD'], cwd=repo_path)
        latest_commit_hash = latest_commit.decode('utf-8').strip()
        last_commit_time = get_last_commit_time(repo_path)
        current_datetime = datetime.now()

        # Convert the last_commit_time to a datetime object
        last_commit_time = datetime.fromtimestamp(last_commit_time)

        time_difference_str = get_time_difference_str(last_commit_time)

    else:
        branch_name = None
        latest_commit_hash = None
        time_difference_str = None

    response_json = {
        "repo_name": repo_name,
        "branch_name": branch_name,
        "latest_commit_hash": str(latest_commit_hash),
        "last_commit_time_difference": time_difference_str
    }
    return response_json

def read_info(email):
    # Open the info.json file and load its contents into a Python dictionary
    with open(os.path.join("../user", email, 'AIFiles', 'info.json')) as f:
        data = json.load(f)

    # Get the home_path value from the dictionary
    path = data['current_repo']
    if path == "" or path == None:
        return None

    path = "../user/" + email + "/" + path
    return path

def read_info_short(email):
    # Open the info.json file and load its contents into a Python dictionary
    with open(os.path.join("../user", email, 'AIFiles', 'info.json')) as f:
        data = json.load(f)

    # Get the home_path value from the dictionary
    path = data['current_repo']
    if path == "" or path == None:
        return None

    return path



def getbranchInfo(repo_name=True):
    email = "public@gmail.com"
    # Open info.json and read the path
    
    repo_path = "../user/"+email+"/"+repo_name

    # Check the current branch of the repo
    if os.path.exists(os.path.join(repo_path, '.git')):
        output = subprocess.check_output(['git', 'symbolic-ref', '--short', 'HEAD'], cwd=repo_path)
        branch_name = output.decode('utf-8').strip()
        latest_commit = subprocess.check_output(['git', 'rev-parse', '--short', 'HEAD'], cwd=repo_path)
        latest_commit_hash = latest_commit.decode('utf-8').strip()
        last_commit_time = get_last_commit_time(repo_path)
        current_datetime = datetime.now()

        # Convert the last_commit_time to a datetime object
        last_commit_time = datetime.fromtimestamp(last_commit_time)

        time_difference_str = get_time_difference_str(last_commit_time)

    else:
        branch_name = None
        latest_commit_hash = None
        time_difference_str = None

    response_json = {
        "repo_name": repo_name,
        "branch_name": branch_name,
        "latest_commit_hash": str(latest_commit_hash),
        "last_commit_time_difference": time_difference_str
    }
    return response_json

