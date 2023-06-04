from gitignore_parser import parse_gitignore
import os
def files2analyze(path, email):
    file_paths_details = []

    if os.path.exists(os.path.join("user", email, '.AIIgnore'+path)):
        AIignore = parse_gitignore(os.path.join("user", email, '.AIIgnore'+path))

    else:
        AIignore = lambda x: False
        # Returns False for all inputs, i.e., no files or directories will be ignored

    print("Running File2Analyze")

    for root, directories, files in os.walk(os.path.join("user", email, path)):
        # Check if the current directory should be ignored
        print(root)

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
                if not filename.endswith(('.jpg', '.svg', '.gif', '.png', '.jpeg', '.ico', '.pdf', '.docx', '.doc', '.xlsx', '.xls', '.pptx', '.ppt', '.txt', '.zip', '.rar', '.7z', '.mp4', '.webm', '.avi', '.mkv', '.flv', '.mpeg', '.mpg', '.ogg', '.ogv', '.webm', '.wmv', 'ttf')):
                    file_paths_details.append(os.path.join(root, filename))

    return file_paths_details