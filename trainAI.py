import pandas as pd, json, os, chardet, openai
from utilities.embedding import split_embed
from utilities.create_clone import create_clone
from utilities.tokenCount import tokenCount
from utilities.AskGPT import AskGPT
from utilities.files2analyze import files2analyze

from utilities.logger import log, clear_logs

text_file = open("API_key.txt", "r")
openai.api_key = text_file.read()
text_file.close()


def summarize_str(filename, file_contents):
    prompt = "File " + filename + " has " + file_contents
    system_message = "Summarize what this file in the codebase does, assume context when neccessary."
    return AskGPT(model="gpt-3.5-turbo", system_message=system_message, prompt=prompt, temperature=0, max_tokens=256)


def summarize_file(path, file):
    with open(os.path.join(path, file), 'rb') as f:
        result = chardet.detect(f.read())
    if not (result['encoding'] == 'ascii' or result['encoding'] == 'ISO-8859-1'):
        p = ("File " + file + " was not Analyzed as it is not a text file")
        log(p)
        # print(result['encoding'])
        return "Ignore"

    p = ("Analyzing " + file)
    log(p)
    full_file_path = os.path.join(path, file)
    with open(full_file_path, 'r') as f:
        file_contents = f.read()
    if tokenCount(file_contents) > 3000:
        p = ("File " + file + " was not analyzed as it is too long")
        log(p)
        return "File content too long"
    return summarize_str(file, file_contents)


def train_AI(path):
    log("Training AI")

    fsfilename = "AIFiles/" "fs_" + path.split('/')[-1] + ".csv"

    file_paths_details = files2analyze(path)

    fs = pd.DataFrame(file_paths_details)
    fs.columns = ['file_path']

    log("Starting analysis")
    fs['summary'] = fs.apply(lambda x: summarize_file(path, x['file_path']), axis=1)

    fs.to_csv(fsfilename, index=False)
    log("Analyzed all files successfully")
    log('Evaluating code blocks')

    fs = pd.read_csv(fsfilename)

    fs['embedding'] = fs['summary'].apply(lambda x: split_embed(x))

    with open('AIFiles/info.json', 'r') as f:
        data = json.load(f)
        # check if the key 'repos' exists
        if 'repos' not in data:
            data['repos'] = []
        # check if the value of the key 'path' is not in the list of repos
        if path not in data['repos']:
            data['repos'].append(path)

    with open(os.path.join('AIFiles', 'info.json'), 'w') as outfile:
        json.dump(data, outfile)

    fs.to_csv(fsfilename, index=False)
    print("100% Done")
    log("100% Done. Synchronizing Files")
    create_clone(path)
    clear_logs()
    return
