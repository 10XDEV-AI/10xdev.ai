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
                if check_file_type(os.path.join(root, filename)):
                    # Append the file path relative to the root of the repo
                    file_paths_details.append(os.path.relpath(os.path.join(root, filename), os.path.join("../user", email, repo_name)))

    return file_paths_details


def parse_ignore_file(file_path):
    with open(file_path, 'r') as f:
        patterns = [line.strip() for line in f if line.strip() and not line.strip().startswith('#')]
    return lambda x: any(fnmatch.fnmatch(x, pattern) for pattern in patterns)

def check_file_type(file_path):
    ignored_extensions = ('.jpg', '.svg', '.gif', '.png', '.jpeg', '.ico', '.pdf', '.docx', '.doc', '.xlsx', '.xls',
                          '.pptx', '.ppt', '.txt', '.zip', '.rar', '.7z', '.mp4', '.webm', '.avi', '.mkv', '.flv',
                          '.mpeg', '.mpg', '.ogg', '.ogv', '.webm', '.wmv', 'ttf', '.bmp', '.ipynb')
    if file_path.endswith(ignored_extensions):
        return False
    if not file_path.endswith(('.c', '.cpp', '.h', '.java', '.js', '.css', '.html', '.htm', '.xml',
                               '.json', '.sql', '.md', '.yml', '.yaml', '.sh', '.bat', '.jsx', '.txt',
                               '.php', '.rb', '.pl', '.swift', '.go', '.cs', '.vb', '.lua', '.scala',
                               '.rust', '.ts', '.scss', '.sass', '.less', '.coffee', '.asm', '.r', '.pyc',
                               '.class', '.dll', '.exe', '.bat', '.ps1')):
        with open(file_path, 'rb') as f:
            if os.path.getsize(file_path) > 400:
                data = f.read(400)  # Read only the first 100 bytes of the file
            else:
                data = f.read()  # Read the entire file

            result = chardet.detect(data)

            if result['encoding'] == 'ascii' or result['encoding'] == 'ISO-8859-1' or result['encoding'] == 'utf-8' or result['encoding'] == 'utf-16':
                return True
    else:
        return True