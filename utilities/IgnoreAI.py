import os, chardet
from gitignore_parser import parse_gitignore
from utilities.tokenCount import tokenCount


def results(file_contents):
    token_count = tokenCount(file_contents)
    tick_or_cross = '✅' if token_count < 4096 else '⚠️'
    return token_count, tick_or_cross


def IgnoreAI(path):
    files2analyse = []
    AIignore = parse_gitignore(os.path.join(path, '.AIignore'))

    print("Files to ignore : " + str(AIignore))
    for root, directories, files in os.walk(path):
        if AIignore(root):
            directories[:] = []  # Don't traverse this directory further
            continue
        for filename in files:
            if AIignore(os.path.join(root, filename)):
                continue
            else:
                # print("File : "+os.path.relpath(os.path.join(root, filename), path))
                with open(os.path.join(root, filename), 'rb') as f:
                    result = chardet.detect(f.read())

                if result['encoding'] == 'ascii' or result['encoding'] == 'ISO-8859-1':
                    file_contents = open(os.path.join(root, filename), 'r', encoding=result['encoding']).read()
                    if len(file_contents.split(' ')) > 4096:
                        files2analyse.append({"Path": os.path.relpath(os.path.join(root, filename), path),
                                              "Tokens": '❌', "Sign": '❌'})
                    else:
                        tokens, sign = results(file_contents)
                        files2analyse.append({"Path": os.path.relpath(os.path.join(root, filename), path),
                                              "Tokens": tokens, "Sign": sign})

    # print("Files to analyse : "+str((files2analyse)))
    files2ignore = open(os.path.join(path, '.AIignore'), 'r').read().splitlines()
    # print("Files to ignore : "+str(files2ignore))
    return files2ignore, files2analyse