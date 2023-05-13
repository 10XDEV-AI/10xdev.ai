import pandas as pd, json, os, chardet, openai
from utilities.embedding import split_embed
from utilities.create_clone import create_clone
from utilities.files2analyze import files2analyze
from utilities.tokenCount import tokenCount
from utilities.logger import log, clear_logs
import time

with open(os.path.join('AIFiles','info.json'), 'r') as f:
    data = json.load(f)
    chat_limit,embedding_limit = data['rates'].split(',')
    openai.api_key = data.get('api_key', None)

def summarize_str(filename,string):
    while True:
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "system", "content": "Summarize what this file in the codebase does, assume context when neccessary."},
                          {"role": "user", "content": "File "+filename+" has "+string}],
                temperature=0,
                max_tokens=256
            )
            return response["choices"][0]["message"]['content']
        except Exception as e:
            log(f"Encountered error: {e}")
            log("Retrying in 20 seconds...")
            time.sleep(20)

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
        p = ("File " + file + " was not analyzed as it is too long")
        log(p)

        return i,"File content too long"
    return i,summarize_str(file,file_contents)


def train_AI(path):
    log("Training AI")

    fsfilename = "AIFiles/" "fs_" + path.split('/')[-1] + ".csv"

    file_paths_details = files2analyze(path)

    if len(file_paths_details) == 0:
        log("No files detected")
        log("Please Add files in the project and train again")
        log("Tip : Start with a ReadME.md")
        time.sleep(5)
        return

    fs = pd.DataFrame(file_paths_details)
    fs.columns = ['file_path']
    start_time = time.time()
    global chat_limit
    delay = 60/int(chat_limit)
    i=0
    fs['summary'] = ''
    fs['embedding'] = ''
    log("Starting analysis")

    for ind in fs.index:
        i_new,fs['summary'][ind] = summarize_file(path,fs['file_path'][ind],i)
        if fs['summary'][ind] != "Ignore":
            fs['embedding'][ind] = split_embed(fs['file_path'][ind])
        if i_new !=i:
            time.sleep(delay)
            i = i_new
        if i != 0:
            rate = 60*i/(time.time() - start_time)
            time_elapsed = time.time() - start_time
            p = (str(round(100*(ind+1)/len(fs))) + "% done. Rate: " + str(round(rate,2)) + " requests/min. Time Elapsed: " +str(round(time_elapsed/60, 2)))
            print(p)
            log(p)
            if rate > int(chat_limit):
                delay = delay + 0.2
                #print("Rate limit reached. Delay increased to " + str(delay) + " seconds")
            if rate < 0.9*int(chat_limit):
                delay = delay * 0.8
                #print("Rate limit not reached. Delay decreased to " + str(delay) + " seconds")

    fs = fs[fs['summary']!="Ignore"]

    log("Analyzed all files successfully")

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
    clear_logs()
    create_clone(path)
    log("-----------------------------------------------------")
    log("***")
    log("Your repo was trained into the AI successfully")
    log("***")
    log("-----------------------------------------------------")
    return