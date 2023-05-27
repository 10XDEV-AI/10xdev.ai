import os, json, subprocess, shutil
from utilities.projectInfo import read_info


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
        current_repo = read_info()
        for repo in info_repos:
            repo_name = repo.split('/')[-1]
            if os.path.exists(os.path.join('AIFiles', repo_name)):
                output = subprocess.check_output(['git', 'symbolic-ref', '--short', 'HEAD'], cwd=repo_name)
                branch_name = output.decode('utf-8').strip()

                if current_repo == repo_name:
                    directories.append({"Directory": repo_name, "Trained": True, "Branch": branch_name, "Full_Path": repo, "Selected": True})
                else:
                    directories.append({"Directory": repo_name, "Trained": True, "Branch": branch_name, "Full_Path": repo,"Selected": False})
            else:
                try:
                    output = subprocess.check_output(['git', 'symbolic-ref', '--short', 'HEAD'], cwd=repo)
                    branch_name = output.decode('utf-8').strip()
                    directories.append(
                        {"Directory": repo_name, "Trained": False, "Branch": branch_name, "Full_Path": repo,"Selected": False})
                except subprocess.CalledProcessError as e:
                    print(f"Error in get_Repos: : {e}")

        #make the repo which has selected appear at the top
        for i in range(len(directories)):
            if directories[i]['Selected'] == True:
                directories.insert(0, directories.pop(i))


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

        with open('AIFiles/info.json', 'r+') as f:
            info = json.load(f)
            f.seek(0)

            repos = info['repos']
            repos = [repo for repo in repos if repo != Full_path]
            print(Full_path)
            print(repos)
            info['repos'] = repos

            if info['current_repo'] == Full_path:
                info['current_repo'] = ""

            f.seek(0)
            f.truncate()
            json.dump(info, f)

        return {"message": f"{repo_name} has been deleted."}, 200
