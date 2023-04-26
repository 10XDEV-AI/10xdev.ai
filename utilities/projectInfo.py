import csv
import os
import subprocess
import simplejson as json

def getprojectInfo(repo_name = True, branch_name = True, full_path = False):
    # Open info.json and read the path

    with open('AIFiles/info.json', 'r') as f:
        data = json.load(f)
        repo_path = data['current_repo']

    repo_name = os.path.basename(repo_path)

    # Check the current branch of the repo
    if os.path.exists(os.path.join(repo_path, '.git')):
        output = subprocess.check_output(['git', 'rev-parse', '--abbrev-ref', 'HEAD'], cwd=repo_path)
        branch_name = output.decode('utf-8').strip()
    else:
        branch_name = None


    response_json = {
        "repo_name": repo_name,
        "branch_name": branch_name
    }

    return response_json

