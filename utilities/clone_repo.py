import os,json
import shutil


def get_clones(url):
    # Check the URL has a real git repository
    try:
        # Delete existing repository if it exists
        if os.path.exists(os.path.splitext(os.path.basename(url))[0]):
            shutil.rmtree(os.path.splitext(os.path.basename(url))[0])

        # Clone the repository
        subprocess.run(['git', 'clone', url])

        # Get the path of the cloned repository
        repo_path = os.path.splitext(os.path.basename(url))[0]

        # Change to the cloned repository directory
        os.chdir(repo_path)

        # Get the list of branches
        branches = subprocess.check_output(['git', 'branch','-r']).decode('utf-8').splitlines()

        # Filter the branch names
        filtered_branches = [branch.replace('*', '').strip() for branch in branches]
        filtered_branches = [branch.replace('origin/HEAD -> origin/', '').strip() for branch in filtered_branches]
        filtered_branches = [branch.replace('origin/', '').strip() for branch in filtered_branches]

        # remove duplicates
        filtered_branches = list(set(filtered_branches))

        # Print the filtered branch names
        print(filtered_branches)

        # Change back to the previous directory
        os.chdir('..')

        with open('AIFiles/info.json', 'r') as f:
            data = json.load(f)
        # check if the key 'repos' exists
        if 'repos' not in data:
            data['repos'] = []
        # check if the value of the key 'path' is not in the list of repos
        if data['repos'] == [""]:
            data['repos'] = []
        if repo_path not in data['repos']:
            data['repos'].append(repo_path)

        with open(os.path.join('AIFiles', 'info.json'), 'w') as outfile:
            json.dump(data, outfile)

        return filtered_branches, 200

    except subprocess.CalledProcessError:
        return [], 404

import subprocess

def select_branch(path, branch):
    # set the branch for repo at path
    path = path.split('/')[-1]
    result = subprocess.run(['git', 'rev-parse', '--abbrev-ref', 'HEAD'], cwd=path, capture_output=True)
    current_branch = result.stdout.decode().strip()
    if str(current_branch) == str(branch):
        print("Already on that branch!")
        return
    else:
        subprocess.run(['git', 'checkout', branch], cwd=path)
        return

def get_branches(path):
    # get the list of branches for repo at path
    path = path.split('/')[-1]
    result = subprocess.run(['git', 'branch','-r'], cwd=path, capture_output=True)
    branches = result.stdout.decode().splitlines()
    filtered_branches = [branch.replace('*', '').strip() for branch in branches]
    filtered_branches = [branch.replace('origin/HEAD -> origin/', '').strip() for branch in filtered_branches]
    filtered_branches = [branch.replace('origin/', '').strip() for branch in filtered_branches]
    return filtered_branches,200

