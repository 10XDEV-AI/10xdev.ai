import os, json, subprocess, shutil


def select_repo(Full_Path):
    try:
        with open(os.path.join('AIFiles', 'info.json'), 'r') as f:
            info = json.load(f)
            info['current_repo'] = Full_Path
        with open(os.path.join('AIFiles', 'info.json'), 'w') as f:
            json.dump(info, f)
        return 'Success'
    except Exception as e:
        return f'Error: {e}'


def list_repos():
    with open(os.path.join('AIFiles', 'info.json'), 'r') as f:
        info = json.load(f)

    directories = []

    info_repos = info['repos']

    print(info_repos)
    if len(info_repos) != 0:
        for repo in info_repos:
            print(repo)
            repo_name = repo.split('/')[-1]
            if os.path.exists(os.path.join('AIFiles', repo_name)):
                output = subprocess.check_output(['git', 'symbolic-ref', '--short', 'HEAD'], cwd=repo_name)
                branch_name = output.decode('utf-8').strip()
                directories.append({"Directory": repo_name, "Trained": True, "Branch": branch_name, "Full_Path": repo})
            else:
                try:
                    output = subprocess.check_output(['git', 'symbolic-ref', '--short', 'HEAD'], cwd=repo)
                    branch_name = output.decode('utf-8').strip()
                    directories.append(
                        {"Directory": repo_name, "Trained": False, "Branch": branch_name, "Full_Path": repo})
                except subprocess.CalledProcessError as e:
                    print(f"Error in get_Repos: : {e}")

    return directories


def delete_repo(Full_path):
    if Full_path is None or Full_path.strip() == "":
        return ({"message": "Invalid directory name."}), 400
    repo_name = Full_path.split('/')[-1]
    if os.path.exists(repo_name):
        shutil.rmtree(repo_name)
    repo_path = os.path.join('AIFiles', repo_name)
    if os.path.exists(repo_path):
        shutil.rmtree(repo_path)

        filename = "AIFiles/" "fs_" + repo_path.split('/')[-1] + ".csv"
        if os.path.exists(filename):
            os.remove(filename)

        with open('AIFiles/info.json', 'r') as f:
            info = json.load(f)
            repos = info['repos']
            if Full_path in repos:
                repos.remove(Full_path)
                info['repos'] = repos
            if info['current_repo'] == Full_path:
                info['current_repo'] = ""
            else:
                return {"message": f"{repo_name} does not exist in the list of repositories."}, 404

        with open('AIFiles/info.json', 'w') as f:
            json.dump(info, f)

        return {"message": f"{repo_name} has been deleted."}, 200
    else:
        return {"message": f"{repo_name} does not exist."}, 404
