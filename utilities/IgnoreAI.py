import chardet, os, fnmatch, re
from utilities.tokenCount import tokenCount
from concurrent.futures import ThreadPoolExecutor
from utilities.notebook_utils import convert_ipynb_to_python

def process_file(root, filename, path, user_logger):
    # Skip file types like jpg, svg, gif, etc.
    if filename.endswith(('.jpg', '.svg', '.gif', '.png', '.jpeg', '.ico', '.pdf', '.docx', '.doc', '.xlsx', '.xls', '.pptx', '.ppt', '.txt', '.zip', '.rar', '.7z', '.mp4', '.webm', '.avi', '.mkv', '.flv', '.mpeg', '.mpg', '.ogg', '.ogv', '.webm', '.wmv', '.ttf', '.bmp' )):
        return {"Path": os.path.relpath(os.path.join(root, filename), path), "Tokens": 'NA', "Sign": 'ℹ️'}

    if not filename.endswith(('.c', '.cpp', '.h', '.java', '.js', '.css', '.html', '.htm', '.xml', '.json', '.sql', '.md', '.yml', '.yaml', '.sh', '.bat', '.jsx', '.txt', '.php', '.rb', '.pl', '.swift', '.go', '.cs', '.vb', '.lua', '.scala', '.rust', '.ts', '.scss', '.sass', '.less', '.coffee', '.asm', '.r', '.pyc', '.class', '.dll', '.exe', '.bat', '.ps1')):
        # Code to handle the file with the supported extensions
        user_logger.log("Analysing new data type: " + str(filename))
        with open(os.path.join(root, filename), 'rb') as f:
            if os.path.getsize(os.path.join(root, filename)) > 400:
                data = f.read(400)  # Read only the first 100 bytes of the file
            else:
                data = f.read()  # Read the entire file
        result = chardet.detect(data)
        if result['encoding'] == 'ascii' or result['encoding'] == 'ISO-8859-1' or result['encoding'] == 'utf-8' or result['encoding'] == 'utf-16':
            pass
        else:
            return {"Path": os.path.relpath(os.path.join(root, filename), path), "Tokens": 'NA', "Sign": 'info'}

    try:
        file_contents = open(os.path.join(root, filename), 'r').read()
    except UnicodeDecodeError:
        return {"Path": os.path.relpath(os.path.join(root, filename), path), "Tokens": 'NA', "Sign": 'info'}

    if filename.endswith("ipynb"):
        file_contents = convert_ipynb_to_python(os.path.join(root, filename))
        if len(re.split(r'[.,;\n\s]+', file_contents)) > 15000:
            return {"Path": os.path.relpath(os.path.join(root, filename), path), "Tokens": 'NA', "Sign": 'warning'}

        tick_or_cross = 'success' if tokenCount(file_contents) < 15000 else 'warning'
        return {"Path": os.path.relpath(os.path.join(root, filename), path), "Tokens": tokenCount(file_contents), "Sign": tick_or_cross}

    if len(re.split(r'[.,;\n\s]+', file_contents)) > 15000:
        return {"Path": os.path.relpath(os.path.join(root, filename), path), "Tokens": 'NA', "Sign": 'warning'}
    else:
        token_count = tokenCount(file_contents)
        tick_or_cross = 'success' if token_count < 15000 else 'warning'
        return {"Path": os.path.relpath(os.path.join(root, filename), path), "Tokens": token_count, "Sign": tick_or_cross}



def IgnoreAI(email, user_logger, path):
    files2analyse = []

    ignore_file_path = os.path.join("../user", email, '.AIIgnore' + path)
    AIignore = parse_ignore_file(ignore_file_path) if os.path.exists(ignore_file_path) else lambda x: False

    with ThreadPoolExecutor() as executor:
        futures = []

        for root, directories, files in os.walk(os.path.join("../user", email, path)):
            relpath = os.path.relpath(root, os.path.join("../user", email, path))
            if AIignore(relpath) or (any(d.startswith(".") for d in relpath.split(os.path.sep)) and relpath != "."):
                #print("Ignoring directory " + relpath)
                directories[:] = []  # Don't traverse this directory further
                continue

            for filename in files:
                relfilepath = os.path.relpath(os.path.join(root, filename), os.path.join("../user", email, path))
                if AIignore(relfilepath):
                    continue
                else:
                    if not is_file_ignored(filename):
                        futures.append(executor.submit(process_file, root, filename, os.path.join("../user",email,path), user_logger))
                        #print("Processing file:", os.path.join(root, filename))

        for future in futures:
            result = future.result()
            if result:
                files2analyse.append(result)
    files2ignore = open(os.path.join("../user", email, '.AIIgnore' + path), 'r').read().splitlines()
    user_logger.clear_logs()
    return files2ignore, files2analyse



def parse_ignore_file(file_path):
    with open(file_path, 'r') as f:
        patterns = [line.strip() for line in f if line.strip() and not line.strip().startswith('#')]
    return lambda x: any(fnmatch.fnmatch(x, pattern) for pattern in patterns)


def is_file_ignored(filename):
    ignored_extensions = ('.jpg', '.svg', '.gif', '.png', '.jpeg', '.ico', '.pdf', '.docx', '.doc', '.xlsx', '.xls',
                          '.pptx', '.ppt', '.txt', '.zip', '.rar', '.7z', '.mp4', '.webm', '.avi', '.mkv', '.flv',
                          '.mpeg', '.mpg', '.ogg', '.ogv', '.webm', '.wmv', 'ttf')
    return filename.endswith(ignored_extensions)

