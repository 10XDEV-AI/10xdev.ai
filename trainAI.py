import openai
import pandas as pd
import json
import os
import chardet
from gitignore_parser import parse_gitignore
from utilities.embedding import get_embedding
from utilities.create_clone import create_clone
from utilities.tokenCount import tokenCount
from utilities.AskGPT import AskGPT
import time

from utilities.logger import log, get_last_logs, clear_logs

fs = pd.DataFrame()

text_file = open("API_key.txt", "r")
openai.api_key =  text_file.read()
text_file.close()

def split_sent(s1):
    words = s1.split()  # split string into words
    #print(words)
    n = 8  # split every n words
    chunks = [words[i:i+n] for i in range(0, len(words), n)]  # split into chunks of size n
    result = [' '.join(chunk) for chunk in chunks]  # join chunks into strings
    return result

def summarize_str(filename,file_contents):
    prompt = "File "+filename+" has "+file_contents
    system_message = "Summarize what this file in the codebase does, assume context when neccessary."
    return AskGPT(model = "gpt-3.5-turbo", system_message = system_message, prompt=prompt, temperature=0, max_tokens=256)

def summarize_file(path,file,i):
    with open(os.path.join(path, file), 'rb') as f:
        result = chardet.detect(f.read())
    if not(result['encoding'] == 'ascii' or result['encoding'] == 'ISO-8859-1'):
            p=("File "+file+" was not Analyzed as it is not a text file")
            log(p)
            #print(result['encoding'])
            return i,"Ignore"
    i+=1
    p=("Analyzing "+file)
    log(p)
    full_file_path = os.path.join(path, file)
    with open(full_file_path, 'r') as f:
        file_contents = f.read()
    if tokenCount(file_contents) > 3000:
        p = ("File "+file+" was not analyzed as it is too long")
        log(p)
        return i,"File content too long"
    return i,summarize_str(file,file_contents)


def walk_and_analyze(path):
    file_paths_details = []

    if not os.path.exists(os.path.join(path, '.AIignore')):
        log("AIignore does not exist. Creating one.")
        with open(os.path.join(path, '.AIignore'), 'w') as f:
            # You can add any initial content you want in the .AIignore file
            f.write("")

    AIignore = parse_gitignore(os.path.join(path,'.AIignore'))
    for root, directories, files in os.walk(path):
        # Check if the current directory should be ignored
        if AIignore(root):
            directories[:] = []  # Don't traverse this directory further
            continue

        # Process all non-ignored files in the directory
        for filename in files:
            if AIignore(os.path.join(root, filename)):
                continue  # Ignore this file
            else:
                # Process the file
                #log("Evaluating size for : "+os.path.relpath(os.path.join(root, filename), path))

                file_paths_details.append(os.path.relpath(os.path.join(root, filename), path))
    return file_paths_details

def train_AI(path):
    log("Training AI")

    fsfilename  = "AIFiles/" "fs_"+path.split('/')[-1]+".csv"

    file_paths_details = walk_and_analyze(path)
    p=("Total number of files analyzed:", len(file_paths_details))
    #log(p)
    fs = pd.DataFrame(file_paths_details)
    #display(fs)

    fs.columns = ['file_path']
    start_time = time.time()
    rate_limit = 3
    delay = 60/rate_limit
    i=0
    fs['summary'] = ''
    log("Starting analysis")
    fs['summary'] = fs.apply(lambda x: summarize_file(path,x['file_path'],i), axis=1)

    fs.to_csv(fsfilename,index=False)
    log("Analyzed all files succesfully")
    #display(fs)

    log('Evaluating code blocks')
    i=0
    fs = pd.read_csv(fsfilename)
    #display(fs)
    rate_limit = 60
    start_time = time.time()
    delay = 60/rate_limit
    fs['embedding'] = ''
    for ind in fs.index:
        if str(fs['summary'][ind])=="Ignore":
            sentences = [fs['file_path'][ind]]
        else:
            sentences = split_sent(str(fs['summary'][ind]))
            sentences = [x for x in sentences if x != '']

        sentence_embeddings = [get_embedding(x,delay) for x in sentences]
        fs['embedding'][ind] = sentence_embeddings
        i+=len(sentences)
        rate = 60*i/(time.time() - start_time)
        time_elapsed = time.time() - start_time
        p = (str(round(100*ind/len(fs))) + "% done. Rate: " + str(round(rate,2)) + " blocks/min. Time Elapsed: " +str(round(time_elapsed/60,2)) + " minutes Time remaining: " + str(round((len(fs)-ind)/rate,2)) + " minutes")
        print(p)
        log(p)
        if rate > rate_limit:
            delay = delay + 0.1
            #print("Rate limit reached. Delay increased to " + str(delay) + " seconds")
        if rate < 0.95*rate_limit:
            delay = delay * 0.9
            #print("Rate limit not reached. Delay decreased to " + str(delay) + " seconds")

    #display(fs)
    with open('AIFiles/info.json', 'r') as f:
            data = json.load(f)
            #check if the key 'repos' exists
            if 'repos' not in data:
                data['repos'] = []
            #check if the value of the key 'path' is not in the list of repos
            if path not in data['repos']:
                data['repos'].append(path)

    with open(os.path.join('AIFiles','info.json'), 'w') as outfile:
        json.dump(data, outfile)

    fs.to_csv(fsfilename,index=False)
    print("100% Done")
    log("100% Done. Synchronizing Files")
    create_clone(path)
    clear_logs()
    return
