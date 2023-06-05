import os
import fnmatch

def files2analyse(repo_name, email):
    file_paths_details = []

    ignore_file_path = os.path.join("user", email, '.AIIgnore' + repo_name)
    AIignore = parse_ignore_file(ignore_file_path) if os.path.exists(ignore_file_path) else lambda x: False

    print("Running File2Analyze")

    for root, directories, files in os.walk(os.path.join("user", email, repo_name)):
        # Check if the current directory should be ignored
        print(root)

        relpath = os.path.relpath(root, os.path.join("user", email, repo_name))
        if AIignore(relpath) or any(d.startswith(".") for d in root.split(os.path.sep)):
            print("Ignoring directory " + relpath)
            directories[:] = []  # Don't traverse this directory further
            continue


        print("Processing directory " + relpath)
        print(len(files))

        # Process all non-ignored files in the directory
        for filename in files:
            if AIignore(os.path.join(root, filename)):
                continue  # Ignore this file
            else:
                if not is_file_ignored(filename):
                    # Append the file path relative to the root of the repo
                    file_paths_details.append(os.path.relpath(os.path.join(root, filename), os.path.join("user", email, repo_name)))

    return file_paths_details


def parse_ignore_file(file_path):
    with open(file_path, 'r') as f:
        patterns = [line.strip() for line in f if line.strip() and not line.strip().startswith('#')]
    return lambda x: any(fnmatch.fnmatch(x, pattern) for pattern in patterns)


def is_file_ignored(filename):
    ignored_extensions = ('.jpg', '.svg', '.gif', '.png', '.jpeg', '.ico', '.pdf', '.docx', '.doc', '.xlsx', '.xls',
                          '.pptx', '.ppt', '.txt', '.zip', '.rar', '.7z', '.mp4', '.webm', '.avi', '.mkv', '.flv',
                          '.mpeg', '.mpg', '.ogg', '.ogv', '.webm', '.wmv', 'ttf')
    return filename.endswith(ignored_extensions)
