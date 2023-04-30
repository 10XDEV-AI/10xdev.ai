import pandas as pd,json,os,time,chardet,openai
from utilities.embedding import get_embedding
from utilities.create_clone import create_clone
from utilities.tokenCount import tokenCount
from utilities.AskGPT import AskGPT
from utilities.files2analyze import files2analyze

from utilities.logger import log, clear_logs

fs = pd.DataFrame()

text_file = open("API_key.txt", "r")
openai.api_key =  text_file.read()
text_file.close()

def split_sent(s1):
    words = s1.split()  # split string into words
    n = 8  # split every n words
    chunks = [words[i:i+n] for i in range(0, len(words), n)]  # split into chunks of size n
    result = [' '.join(chunk) for chunk in chunks]  # join chunks into strings
    return result

def summarize_str(filename,file_contents):
    prompt = "File "+filename+" has "+file_contents
    system_message = "Summarize what this file in the codebase does, assume context when neccessary."
    return AskGPT(model = "gpt-3.5-turbo", system_message = system_message, prompt=prompt, temperature=0, max_tokens=256)

def summarize_file(path,file):
    with open(os.path.join(path, file), 'rb') as f:
        result = chardet.detect(f.read())
    if not(result['encoding'] == 'ascii' or result['encoding'] == 'ISO-8859-1'):
            p=("File "+file+" was not Analyzed as it is not a text file")
            log(p)
            #print(result['encoding'])
            return "Ignore"

    p=("Analyzing "+file)
    log(p)
    full_file_path = os.path.join(path, file)
    with open(full_file_path, 'r') as f:
        file_contents = f.read()
    if tokenCount(file_contents) > 3000:
        p = ("File "+file+" was not analyzed as it is too long")
        log(p)
        return "File content too long"
    return summarize_str(file,file_contents)


def train_AI(path):
    log("Training AI")

    fsfilename  = "AIFiles/" "fs_"+path.split('/')[-1]+".csv"

    file_paths_details = files2analyze(path)
    fs = pd.DataFrame(file_paths_details)
    fs.columns = ['file_path']

    log("Starting analysis")
    fs['summary'] = fs.apply(lambda x: summarize_file(path,x['file_path']), axis=1)

    fs.to_csv(fsfilename,index=False)
    log("Analyzed all files succesfully")


    log('Evaluating code blocks')
    i=0
    fs = pd.read_csv(fsfilename)
    rate_limit = 60
    start_time = time.time()
    delay = 40/rate_limit
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
