import json

def read_info():
    # Open the info.json file and load its contents into a Python dictionary
    with open('AIFiles/info.json') as f:
        data = json.load(f)

    # Get the home_path value from the dictionary
    path = data['current_repo']
    return path
