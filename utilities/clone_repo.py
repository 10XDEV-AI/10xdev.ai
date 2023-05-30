import os, json
import shutil


def get_clones(url, email):
    # Check the URL has a real git repository
    try:
        # Delete existing repository if it exists
        path = os.path.join(email, str(os.path.splitext(os.path.basename(url))[0]))
        if os.path.exists(path):
            shutil.rmtree(path)

        #cd into email folder
        os.chdir(email)

        # Clone the repository into email folder
        subprocess.run(['git', 'clone', url])
        print("Cloned " + url)
        # Get the path of the cloned repository
        repo_path = os.path.splitext(os.path.basename(url))[0]
        print(repo_path)
        # Get the list of branches
        branches = subprocess.check_output(['git', '-C', repo_path, 'branch', '-r']).decode('utf-8').splitlines()

        os.chdir('..')

        filtered_branches = [branch.replace('*', '').strip() for branch in branches]
        filtered_branches = [branch.replace('origin/HEAD -> origin/', '').strip() for branch in filtered_branches]
        filtered_branches = [branch.replace('origin/', '').strip() for branch in filtered_branches]

        # remove duplicates
        filtered_branches = list(set(filtered_branches))

        # Print the filtered branch names
        print(filtered_branches)

        with open(email + '/AIFiles/info.json', 'r') as f:
            data = json.load(f)
        # check if the key 'repos' exists
        if 'repos' not in data:
            data['repos'] = []
        # check if the value of the key 'path' is not in the list of repos
        if data['repos'] == [""]:
            data['repos'] = []
        if repo_path not in data['repos']:
            data['repos'].append(os.path.splitext(os.path.basename(url))[0])

        with open(os.path.join(email, 'AIFiles', 'info.json'), 'w') as outfile:
            json.dump(data, outfile)

        return filtered_branches, 200

    except subprocess.CalledProcessError:
        return [], 404


import subprocess


def select_branch(path, branch, email):
    # set the branch for repo at path
    path = path.split('/')[-1]
    path = path.replace('.git', '')
    result = subprocess.run(['git', 'rev-parse', '--abbrev-ref', 'HEAD'], cwd=email + '/' + path, capture_output=True)
    current_branch = result.stdout.decode().strip()
    if str(current_branch) == str(branch):
        print("Already on that branch!")
        return
    else:
        subprocess.run(['git', 'checkout', branch], cwd=email + '/' + path)
        return


def get_branches(path, email):
    # get the latest pull
    path = path.split('/')[-1]
    subprocess.run(['git', 'pull'], cwd=email + '/' + path)

    result = subprocess.run(['git', 'branch', '-r'], cwd=email + '/' + path, capture_output=True)
    branches = result.stdout.decode().splitlines()
    filtered_branches = [branch.replace('*', '').strip() for branch in branches]
    filtered_branches = [branch.replace('origin/HEAD -> origin/', '').strip() for branch in filtered_branches]
    filtered_branches = [branch.replace('origin/', '').strip() for branch in filtered_branches]
    # remove duplicates
    filtered_branches = list(set(filtered_branches))

    # Print the filtered branch names
    print(filtered_branches)
    return filtered_branches, 200
