import os
import chardet
import re
from gitignore_parser import parse_gitignore
from utilities.tokenCount import tokenCount
from utilities.logger import log, clear_logs
from concurrent.futures import ThreadPoolExecutor

def results(file_contents):
    token_count = tokenCount(file_contents)
    tick_or_cross = '✅' if token_count < 4096 else '⚠️'
    return token_count, tick_or_cross

def process_file(root, filename, path):
    with open(os.path.join(root, filename), 'rb') as f:
        result = chardet.detect(f.read())

    if result['encoding'] == 'ascii' or result['encoding'] == 'ISO-8859-1':
        log("Analysing : "+str(filename))
        file_contents = open(os.path.join(root, filename), 'r', encoding=result['encoding']).read()
        if len(re.split(r'[.,;\n\s]+',file_contents)) > 4096:
            return {"Path": os.path.relpath(os.path.join(root, filename), path), "Tokens": '❌', "Sign": '❌'}
        else:
            tokens, sign = results(file_contents)
            return {"Path": os.path.relpath(os.path.join(root, filename), path), "Tokens": tokens, "Sign": sign}

def IgnoreAI(path):
    files2analyse = []
    AIignore = parse_gitignore(os.path.join(path, '.AIignore'))

    print("Files to ignore : " + str(AIignore))
    with ThreadPoolExecutor() as executor:
        futures = []
        for root, directories, files in os.walk(path):
            if any(d.startswith(".") for d in root.split(os.path.sep)):
                directories[:] = []  # Don't traverse this directory further
                continue
            if AIignore(root):
                directories[:] = []  # Don't traverse this directory further
                continue
            for filename in files:
                if AIignore(os.path.join(root, filename)):
                    continue
                else:
                    futures.append(executor.submit(process_file, root, filename, path))

        for future in futures:
            result = future.result()
            if result:
                files2analyse.append(result)

    # print("Files to analyse : "+str((files2analyse)))
    files2ignore = open(os.path.join(path, '.AIignore'), 'r').read().splitlines()
    # print("Files to ignore : "+str(files2ignore))
    clear_logs()
    return files2ignore, files2analyse
