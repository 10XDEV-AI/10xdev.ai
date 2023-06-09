import shutil
import os


def create_clone(repo_name, email):
    destination = "../user" + '/' + email + "/AIFiles"
    # Check if destination folder exists, delete if it does
    if os.path.exists(os.path.join(destination, repo_name)):
        shutil.rmtree(os.path.join(destination, repo_name))
    # Copy the folder at path to destination
    shutil.copytree(os.path.join("../user", email, repo_name), os.path.join(destination, repo_name))
    # print(f"Successfully created a clone of {path} at {destination}!")


def get_clone_path(repo_name, email):
    return os.path.join("../user", email, "AIFiles", repo_name)


def get_clone_filepath(email, path, filename):
    return os.path.join(get_clone_path(path, email), filename)
