import csv
import os
import subprocess

def getprojectInfo():
    print("Checking Branch")
    # Open csv file and get the first row
    with open('info.csv', 'r') as file:
        reader = csv.reader(file)
        first_row = next(reader)

    # Get the name of the repo from the path
    repo_path = first_row[0]
    repo_name = os.path.basename(repo_path)

    # Check the current branch of the repo
    output = subprocess.check_output(['git', 'rev-parse', '--abbrev-ref', 'HEAD'], cwd=repo_path)
    branch_name = output.decode('utf-8').strip()

    print(f"Repo name: {repo_name}")
    print(f"Current branch: {branch_name}")

    json = {
        "repo_name": repo_name,
        "branch_name": branch_name
    }

    return json