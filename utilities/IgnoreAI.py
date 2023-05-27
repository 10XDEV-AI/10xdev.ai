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
    log("Analysing : "+str(filename))
    with open(os.path.join(root, filename), 'rb') as f:
        result = chardet.detect(f.read())
        log("Analysed the file type "+ filename)

    if result['encoding'] == 'ascii' or result['encoding'] == 'ISO-8859-1':
        log(filename + " is " + result['encoding'])
        file_contents = open(os.path.join(root, filename), 'r', encoding=result['encoding']).read()
        if len(re.split(r'[:,()\[\]{}"\n\s]+', file_contents)) > 4096 or ".pynb" in filename:
            log("Analysed the lenghth "+ filename)
            return {
                "Path": os.path.relpath(os.path.join(root, filename), path),
                "Tokens": '❌',
                "Sign": '❌'
            }
        else:
            log("Analysed the lenghth "+ filename)
            tokens, sign = results(file_contents)
            return {"Path": os.path.relpath(os.path.join(root, filename), path), "Tokens": tokens, "Sign": sign}


def IgnoreAI(path):
    files2analyse = []
    if not os.path.exists(os.path.join(path, '.AIIgnore')):
        with ThreadPoolExecutor() as executor:
            futures = []
            for root, directories, files in os.walk(path):
                if any(d.startswith(".") for d in root.split(os.path.sep)):
                    directories[:] = []  # Don't traverse this directory further
                    continue
                for filename in files:
                    futures.append(executor.submit(process_file, root, filename, path))
                    print("Processing file:", os.path.join(root, filename))

            for future in futures:
                result = future.result()
                if result:
                    files2analyse.append(result)

        clear_logs()
        return [], files2analyse

    AIignore = parse_gitignore(os.path.join(path, '.AIIgnore'))

    with ThreadPoolExecutor() as executor:
        futures = []
        total_files = sum(len(files) for _, _, files in os.walk(path))
        processed_files = 0

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
                    print("Processing file:", os.path.join(root, filename))
                    processed_files += 1
                    remaining_files = total_files - processed_files
                    print("Remaining files:", remaining_files)
                    # Estimate time remaining based on average processing time per file
                    average_processing_time = 2.5  # Adjust this value based on your actual processing time
                    estimated_time_remaining = remaining_files * average_processing_time
                    print("Estimated time remaining:", estimated_time_remaining, "seconds")

        for future in futures:
            result = future.result()
            if result:
                files2analyse.append(result)

    # print("Files to analyse: " + str(files2analyse))
    files2ignore = open(os.path.join(path, '.AIIgnore'), 'r').read().splitlines()
    # print("Files to ignore: " + str(files2ignore))
    clear_logs()
    return files2ignore, files2analyse

