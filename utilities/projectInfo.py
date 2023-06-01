import os
import subprocess
import simplejson as json

def getprojectInfo(email, repo_name=True, branch_name=True, full_path=False):
    # Open info.json and read the path
    with open(os.path.join("user", email, 'AIFiles', 'info.json'), 'r') as f:
        data = json.load(f)

    if data['current_repo'] == "" or data['current_repo'] == None:
        return {"repo_name": "No Repos selected", "branch_name": "No branch selected"}

    repo_path = "user/"+email+"/"+data['current_repo']


    repo_name = repo_path.split('/')[-1]

    # Check the current branch of the repo
    if os.path.exists(os.path.join(repo_path, '.git')):
        output = subprocess.check_output(['git', 'symbolic-ref', '--short', 'HEAD'], cwd=repo_path)
        branch_name = output.decode('utf-8').strip()
    else:
        branch_name = None

    response_json = {
        "repo_name": repo_name,
        "branch_name": branch_name
    }

    return response_json

def read_info(email):
    # Open the info.json file and load its contents into a Python dictionary
    with open(os.path.join("user", email, 'AIFiles', 'info.json')) as f:
        data = json.load(f)

    # Get the home_path value from the dictionary
    path = data['current_repo']
    if path == "" or path == None:
        return None

    path = "user/" + email + "/" + path
    return path
