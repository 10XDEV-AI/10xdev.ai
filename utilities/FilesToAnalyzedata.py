import chardet
import os
import re
from utilities.tokenCount import tokenCount
from concurrent.futures import ThreadPoolExecutor
from utilities.projectInfo import read_info



def process_file(root, filename, path, user_logger):
    # Skip the .git folder and its contents
    if ".git" in root.split(os.path.sep):
        return None

    # Skip file types like jpg, svg, gif, etc.
    if filename.endswith(('.jpg', '.svg', '.gif', '.png', '.jpeg', '.ico', '.pdf', '.docx', '.doc', '.xlsx', '.xls', '.pptx', '.ppt', '.txt', '.zip', '.rar', '.7z', '.mp4', '.webm', '.avi', '.mkv', '.flv', '.mpeg', '.mpg', '.ogg', '.ogv', '.webm', '.wmv', '.ttf', '.bmp', '.ipynb')):
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
            return {"Path": os.path.relpath(os.path.join(root, filename), path), "Tokens": 'NA', "Sign": 'ℹ️'}

    try:
        file_contents = open(os.path.join(root, filename), 'r').read()
    except UnicodeDecodeError:
        return {"Path": os.path.relpath(os.path.join(root, filename), path), "Tokens": 'NA', "Sign": 'ℹ️'}

    if len(re.split(r'[.,;\n\s]+', file_contents)) > 15000:
        return {"Path": os.path.relpath(os.path.join(root, filename), path), "Tokens": 'NA', "Sign": '⚠️'}
    else:
        token_count = tokenCount(file_contents)
        tick_or_cross = '✅' if token_count < 15000 else '⚠️'
        return {"Path": os.path.relpath(os.path.join(root, filename), path), "Tokens": token_count, "Sign": tick_or_cross}




def FilesToAnalyzedata(email, user_logger, path):
    if path == "":
        path = read_info(email).split('/')[-1]
        print(path)
    files_paths = []

    with ThreadPoolExecutor() as executor:
        futures = []


        for root, _, files in os.walk(os.path.join("../user", email, path)):
            for filename in files:
                futures.append(executor.submit(process_file, root, filename, os.path.join("../user", email, path), user_logger))

        for future in futures:
            result = future.result()
            if result:
                files_paths.append(result)

    user_logger.clear_logs()
    files2ignore = open(os.path.join("../user", email, '.AIIgnore' + path), 'r').read().splitlines()
    return files2ignore, files_paths
