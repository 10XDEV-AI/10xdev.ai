import os, json, subprocess, shutil
from utilities.projectInfo import read_info

def select_repo(Full_Path,email):
    try:
        with open(os.path.join("../user", email, 'AIFiles', 'info.json'), 'r') as f:
            info = json.load(f)
            info['current_repo'] = Full_Path
        with open(os.path.join("../user", email, 'AIFiles', 'info.json'), 'w') as f:
            json.dump(info, f)
        return 'Success'
    except Exception as e:
         return f'Error: {e}'

def list_repos(email):
    with open(os.path.join("../user", email,'AIFiles', 'info.json'), 'r') as f:
        info = json.load(f)

    directories = []

    info_repos = info['repos']
    print(info_repos)

    if len(info_repos) != 0:
        current_repo = str(read_info(email)).split('/')[-1]
        for repo in info_repos:
            repo_name = repo.split('/')[-1]
            repo_path = os.path.join("../user", email,'AIFiles', repo_name)
            if os.path.exists(repo_path):
                output = subprocess.check_output(['git', 'symbolic-ref', '--short', 'HEAD'], cwd=repo_path)
                branch_name = output.decode('utf-8').strip()

                if current_repo == repo_name:
                    directories.append({"Directory": repo_name, "Trained": True, "Branch": branch_name, "Selected": True})
                else:
                    directories.append({"Directory": repo_name, "Trained": True, "Branch": branch_name, "Selected": False})
            else:
                try:
                    output = subprocess.check_output(['git', 'symbolic-ref', '--short', 'HEAD'], cwd=os.path.join("../user", email, repo_name))
                    branch_name = output.decode('utf-8').strip()
                    directories.append(
                        {"Directory": repo_name, "Trained": False, "Branch": branch_name, "Selected": False})
                except subprocess.CalledProcessError as e:
                    print(f"Error in get_Repos: : {e}")

        #make the repo which has selected appear at the top
        for i in range(len(directories)):
            if directories[i]['Selected'] == True:
                directories.insert(0, directories.pop(i))
    return directories

def delete_repo(Full_path,email):
    if Full_path is None or Full_path.strip() == "":
        return ({"message": "Invalid directory name."}), 400
    repo_name = Full_path
    if os.path.exists("../user/" + email+"/"+repo_name):
        shutil.rmtree("../user/" + email+"/"+repo_name)
    repo_path = os.path.join("../user", email, 'AIFiles', repo_name)
    if os.path.exists(repo_path):
        shutil.rmtree(repo_path)

    filename = "../user/" + email+ "/AIFiles/"+ repo_path.split('/')[-1] + ".csv"
    if os.path.exists(filename):
        os.remove(filename)

    filename = "../user/" + email+ "/.AIIgnore"+ repo_path.split('/')[-1]
    if os.path.exists(filename):
        os.remove(filename)

    filename = "../user/"+email+"/AIFiles/"+repo_path.split('/')[-1]+"_full_project_info.txt"
    if os.path.exists(filename):
        os.remove(filename)

    filename = "../user/"+email+"/AIFiles/"+repo_path.split('/')[-1]+"_file_data.csv"
    if os.path.exists(filename):
        os.remove(filename)

    with open("../user/" + email+'/AIFiles/info.json', 'r+') as f:
        info = json.load(f)
        f.seek(0)

        repos = info['repos']
        repos = [repo for repo in repos if repo != Full_path]

        info['repos'] = repos

        if info['current_repo'] == Full_path:
            info['current_repo'] = ""

        f.seek(0)
        f.truncate()
        json.dump(info, f)

    trained_repos = [repo for repo in list_repos(email) if repo["Trained"]]
    if trained_repos:
        select_repo(trained_repos[0]["Directory"], email)

    return {"message": 'f"{repo_name} has been deleted.'}, 200
