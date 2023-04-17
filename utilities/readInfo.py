import json

def read_info():
    # Open the info.json file and load its contents into a Python dictionary
    with open('info.json') as f:
        data = json.load(f)

    # Get the home_path value from the dictionary
    path = data['path']
    return path
