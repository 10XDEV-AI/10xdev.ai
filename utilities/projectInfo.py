import csv
import os
import subprocess
import simplejson as json

def getprojectInfo():
    # Open info.json and read the path

    with open('AIFiles/info.json', 'r') as f:
        data = json.load(f)
        repo_path = data['current_repo']

    repo_name = os.path.basename(repo_path)

    # Check the current branch of the repo
    output = subprocess.check_output(['git', 'rev-parse', '--abbrev-ref', 'HEAD'], cwd=repo_path)
    branch_name = output.decode('utf-8').strip()

    response_json = {
        "repo_name": repo_name,
        "branch_name": branch_name
    }

    return response_json