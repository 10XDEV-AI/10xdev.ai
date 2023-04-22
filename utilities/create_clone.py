import shutil
import os

def create_clone(path):
    folder_name = path.split('/')[-1]
    destination = "AIFiles"
    # Check if destination folder exists, delete if it does
    if os.path.exists(os.path.join(destination, folder_name)):
        shutil.rmtree(os.path.join(destination, folder_name))
    # Copy the folder at path to destination
    shutil.copytree(path, os.path.join(destination, folder_name))
    print(f"Successfully created a clone of {path} at {destination}!")


def get_clone_path(path):
    folder_name = path.split('/')[-1]
    return os.path.join("AIFiles", folder_name)


def get_clone_filepath(path, filename):
    return os.path.join(get_clone_path(path), filename)