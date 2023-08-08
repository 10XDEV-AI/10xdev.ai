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

    if not filename.endswith(('.c', '.cpp', '.h', '.java', '.js', '.css', '.html', '.htm', '.xml', '.json', '.sql', '.md', '.yml', '.yaml', '.sh', '.bat', '.jsx', '.txt', '.php', '.rb', '.pl', '.swift', '.go', '.cs', '.vb', '.lua', '.scala', '.rust', '.ts', '.scss', '.sass', '.less', '.coffee', '.asm', '.r', '.pyc', '.class', '.dll', '.exe', '.bat', '.ps1')):
        # Code to handle the file with the supported extensions
        user_logger.log("Analysing new data type: " + str(filename))
        with open(os.path.join(root, filename), 'rb') as f:
            if os.path.getsize(os.path.join(root, filename)) > 400:
                data = f.read(400)  # Read only the first 400 bytes of the file
            else:
                data = f.read()  # Read the entire file
        result = chardet.detect(data)
        if result['encoding'] not in ['ascii', 'ISO-8859-1', 'utf-8', 'utf-16']:
            return {"Path": os.path.relpath(os.path.join(root, filename), path)}

    try:
        file_contents = open(os.path.join(root, filename), 'r', encoding='utf-8', errors='ignore').read()
    except UnicodeDecodeError:
        return {"Path": os.path.relpath(os.path.join(root, filename), path)}

    if len(re.split(r'[.,;\n\s]+', file_contents)) > 15000:
        return {"Path": os.path.relpath(os.path.join(root, filename), path)}
    else:
        token_count = tokenCount(file_contents)
        tick_or_cross = '✅' if token_count < 15000 else '⚠️'
        code = file_contents  # Storing the file code
        extension = os.path.splitext(filename)[-1][1:].lower()  # Removing the dot from the extension
        return {"Path": os.path.relpath(os.path.join(root, filename), path), "Code": code, "Extension": extension}


def FilesToAnalyzedata(email, user_logger, path):
    if path == "":
        path = read_info(email).split('/')[-1]
        print(path)
    files_data = []

    with ThreadPoolExecutor() as executor:
        futures = []

        for root, _, files in os.walk(os.path.join("../user", email, path)):
            for filename in files:
                futures.append(executor.submit(process_file, root, filename, os.path.join("../user", email, path), user_logger))

        for future in futures:
            result = future.result()
            if result:
                files_data.append(result)

    user_logger.clear_logs()
    files2ignore = open(os.path.join("../user", email, '.AIIgnore' + path), 'r').read().splitlines()
    return files2ignore, files_data


# Call the function with email, user_logger, and path
# For example:
# files2ignore, files_data = FilesToAnalyzedata("example_email", user_logger, "example_path")
# You can replace "example_email" and "example_path" with actual values.
