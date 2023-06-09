import chardet
import re
from utilities.tokenCount import tokenCount
from concurrent.futures import ThreadPoolExecutor
import fnmatch

def results(file_contents):
    token_count = tokenCount(file_contents)
    tick_or_cross = '✅' if token_count < 4096 else '⚠️'
    return token_count, tick_or_cross
import os

def process_file(root, filename, path, user_logger):
    # Skip file types like jpg, svg, gif, etc.
    if filename.endswith(('.jpg', '.svg', '.gif', '.png', '.jpeg', '.ico', '.pdf', '.docx', '.doc', '.xlsx', '.xls', '.pptx', '.ppt', '.txt', '.zip', '.rar', '.7z', '.mp4', '.webm', '.avi', '.mkv', '.flv', '.mpeg', '.mpg', '.ogg', '.ogv', '.webm', '.wmv', '.ttf', '.bmp' )):
        return None

    with open(os.path.join(root, filename), 'rb') as f:
        result = chardet.detect(f.read())

    if result['encoding'] == 'ascii' or result['encoding'] == 'ISO-8859-1' or result['encoding'] == 'utf-8' or result['encoding'] == 'utf-16':
        user_logger.log("Analysing: " + str(filename))

        file_contents = open(os.path.join(root, filename), 'r', encoding=result['encoding']).read()
        if len(re.split(r'[.,;\n\s]+', file_contents)) > 4096:
            return {"Path": os.path.relpath(os.path.join(root, filename), path), "Tokens": '⚠️', "Sign": '⚠️'}
        else:
            tokens, sign = results(file_contents)
            return {"Path": os.path.relpath(os.path.join(root, filename), path), "Tokens": tokens, "Sign": sign}

        user_logger.log("Analysing: " + str(filename))

        file_contents = open(os.path.join(root, filename), 'r', encoding=result['encoding']).read()
        if len(re.split(r'[.,;\n\s]+', file_contents)) > 4096:
            return {"Path": os.path.relpath(os.path.join(root, filename), path), "Tokens": '❌', "Sign": '❌'}
        else:
            tokens, sign = results(file_contents)
            return {"Path": os.path.relpath(os.path.join(root, filename), path), "Tokens": tokens, "Sign": sign}
    else:
        return None


def IgnoreAI(email, user_logger, path):
    files2analyse = []

    ignore_file_path = os.path.join("../user", email, '.AIIgnore' + path)
    AIignore = parse_ignore_file(ignore_file_path) if os.path.exists(ignore_file_path) else lambda x: False

    with ThreadPoolExecutor() as executor:
        futures = []

        for root, directories, files in os.walk(os.path.join("../user", email, path)):
            relpath = os.path.relpath(root, os.path.join("../user", email, path))
            if AIignore(relpath) or (any(d.startswith(".") for d in root.split(os.path.sep)) and relpath != "."):
                continue
                print("Ignoring directory " + relpath)
                directories[:] = []  # Don't traverse this directory further
                continue

            for filename in files:
                relfilepath = os.path.relpath(os.path.join(root, filename), os.path.join("../user", email, path))
                if AIignore(relfilepath):
                    continue
                else:
                    if not is_file_ignored(filename):
                        futures.append(executor.submit(process_file, root, filename, os.path.join("../user",email,path), user_logger))
                        print("Processing file:", os.path.join(root, filename))

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

