import os, json
import shutil

def get_clones(url, email, user_logger):
    # Delete existing repository if it exists
    path = os.path.join("../user/" + email, str(os.path.splitext(os.path.basename(url))[0]))
    if os.path.exists(path):
        shutil.rmtree(path)

    target_directory = os.path.join("../user", email)
    user_logger.log('Cloning your repository')
    # Clone the repository into email folder
    subprocess.run(['git', 'clone', url], cwd=target_directory)
    print("Cloned " + url)
    # Get the path of the cloned repository
    repo_path = os.path.splitext(os.path.basename(url))[0]

    with open("../user/" + email + '/AIFiles/info.json', 'r') as f:
        data = json.load(f)
    # check if the key 'repos' exists
    if 'repos' not in data:
        data['repos'] = []
    # check if the value of the key 'path' is not in the list of repos
    if data['repos'] == [""]:
        data['repos'] = []
    if repo_path not in data['repos']:
        data['repos'].append(os.path.splitext(os.path.basename(url))[0])

    with open(os.path.join("../user/" + email, 'AIFiles', 'info.json'), 'w') as outfile:
        json.dump(data, outfile)

    #create an empty file names AIignore
    with open(os.path.join("../user/" + email, '.AIIgnore'+repo_path), 'w') as outfile:
        outfile.write("")
        print("Created .AIIgnore file")
    user_logger.clear_logs()
    return


import subprocess

def get_private_clones(url, email, access_token, user_logger):
    user_logger.log('Cloning Your Repository')
    path = os.path.join("../user/" + email, str(os.path.splitext(os.path.basename(url))[0]))
    if os.path.exists(path):
        shutil.rmtree(path)

    # Split the URL to get the username and repository name
    username, repo_name = url.split("/")[-2], url.split("/")[-1].replace(".git", "")

    # Construct the clone URL with the access token
    clone_url = f"https://oauth2:{access_token}@github.com/{username}/{repo_name}.git"


    target_directory = os.path.join("../user", email)

    subprocess.run(['git', 'clone', clone_url], cwd=target_directory)
    print("Cloned " + url)

    # Get the path of the cloned repository
    repo_path = url.split("/")[-1]
    print(repo_path)



    with open("../user/" + email + '/AIFiles/info.json', 'r') as f:
        data = json.load(f)

    # Check if the key 'repos' exists
    if 'repos' not in data:
        data['repos'] = []

    # Check if the value of the key 'path' is not in the list of repos
    if data['repos'] == [""]:
        data['repos'] = []

    if repo_path not in data['repos']:
        data['repos'].append(repo_path)

    with open(os.path.join("../user/" + email, 'AIFiles', 'info.json'), 'w') as outfile:
        json.dump(data, outfile)

    # Create an empty file named .AIIgnore
    with open(os.path.join("../user/" + email, '.AIIgnore'+ repo_path), 'w') as outfile:
        outfile.write("")
    print("Created .AIIgnore file")
    user_logger.clear_logs()
    return

def select_branch(path, branch, email):
    # set the branch for repo at path
    path = path.split('/')[-1]
    path = path.replace('.git', '')
    result = subprocess.run(['git', 'rev-parse', '--abbrev-ref', 'HEAD'], cwd="../user/" + email + '/' + path, capture_output=True)
    current_branch = result.stdout.decode().strip()
    subprocess.Popen(['python', 'syncAI.py', '0', email, email])
    if str(current_branch) == str(branch):
        print("Already on that branch!")
        return
    else:
        subprocess.run(['git', 'checkout', branch], cwd="../user/" + email + '/' + path)
        return



def get_branches(path, email):
    # get the latest pull
    path = path.split('/')[-1]
    subprocess.run(['git', 'pull'], cwd="../user/" + email + '/' + path)

    result = subprocess.run(['git', 'branch', '-r'], cwd= "../user/" + email + '/' + path, capture_output=True)
    branches = result.stdout.decode().splitlines()
    filtered_branches = [branch.replace('*', '').strip() for branch in branches]
    filtered_branches = [branch.replace('origin/HEAD -> origin/', '').strip() for branch in filtered_branches]
    filtered_branches = [branch.replace('origin/', '').strip() for branch in filtered_branches]
    # remove duplicates
    filtered_branches = list(set(filtered_branches))

    # Print the filtered branch names
    print(filtered_branches)
    return filtered_branches, 200
