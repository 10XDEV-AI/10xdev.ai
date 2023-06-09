import os, fnmatch, chardet

def files2analyse(repo_name, email):
    file_paths_details = []

    ignore_file_path = os.path.join("../user", email, '.AIIgnore' + repo_name)
    AIignore = parse_ignore_file(ignore_file_path) if os.path.exists(ignore_file_path) else lambda x: False

    for root, directories, files in os.walk(os.path.join("../user", email, repo_name)):
        # Check if the current directory should be ignored

        relpath = os.path.relpath(root, os.path.join("../user", email, repo_name))
        if AIignore(relpath) or (any(d.startswith(".") for d in relpath.split(os.path.sep)) and relpath != "."):
            directories[:] = []  # Don't traverse this directory further
            continue

        # Process all non-ignored files in the directory
        for filename in files:
            relfilepath = os.path.relpath(os.path.join(root, filename), os.path.join("../user", email, repo_name))
            if AIignore(relfilepath):
                continue  # Ignore this file
            else:
                if not is_file_ignored(filename):
                    # Check file encoding
                    encoding = get_file_encoding(os.path.join(root, filename))
                    if encoding in ['ascii', 'ISO-8859-1', 'utf-8', 'utf-16']:
                        # Append the file path relative to the root of the repo
                        file_paths_details.append(os.path.relpath(os.path.join(root, filename), os.path.join("../user", email, repo_name)))

    return file_paths_details


def parse_ignore_file(file_path):
    with open(file_path, 'r') as f:
        patterns = [line.strip() for line in f if line.strip() and not line.strip().startswith('#')]
    return lambda x: any(fnmatch.fnmatch(x, pattern) for pattern in patterns)


def is_file_ignored(filename):
    ignored_extensions = ('.jpg', '.svg', '.gif', '.png', '.jpeg', '.ico', '.pdf', '.docx', '.doc', '.xlsx', '.xls',
                          '.pptx', '.ppt', '.txt', '.zip', '.rar', '.7z', '.mp4', '.webm', '.avi', '.mkv', '.flv',
                          '.mpeg', '.mpg', '.ogg', '.ogv', '.webm', '.wmv', 'ttf', '.bmp')
    return filename.endswith(ignored_extensions)

def get_file_encoding(file_path):
    try:
        with open(file_path, 'rb') as f:
            result = chardet.detect(f.read())
        return result['encoding']
    except:
        return None
