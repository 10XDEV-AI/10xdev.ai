from gitignore_parser import parse_gitignore
from utilities.logger import log
import os
def files2analyze(path):
    file_paths_details = []

    if not os.path.exists(os.path.join(path, '.AIIgnore')):
        log("AIignore does not exist. Creating one.")
        with open(os.path.join(path, '.AIIgnore'), 'w') as f:
            # You can add any initial content you want in the .AIIgnore file
            f.write("")

    AIignore = parse_gitignore(os.path.join(path,'.AIIgnore'))
    for root, directories, files in os.walk(path):
        # Check if the current directory should be ignored
        if AIignore(root):
            directories[:] = []  # Don't traverse this directory further
            continue
        if any(d.startswith(".") for d in root.split(os.path.sep)):
            directories[:] = []  # Don't traverse this directory further
            continue

        # Process all non-ignored files in the directory
        for filename in files:
            if AIignore(os.path.join(root, filename)):
                continue  # Ignore this file
            else:
                # Process the file
                #log("Evaluating size for : "+os.path.relpath(os.path.join(root, filename), path))

                file_paths_details.append(os.path.relpath(os.path.join(root, filename), path))
    return file_paths_details