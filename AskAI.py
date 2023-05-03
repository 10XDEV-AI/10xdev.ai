import pandas as pd
import regex as re
import os,json,openai
import chardet
from utilities.embedding import get_embedding
from openai.embeddings_utils import cosine_similarity
from utilities.readInfo import read_info
from utilities.str2float import str2float
from utilities.logger import log, clear_logs
from utilities.AskGPT import AskGPT
from utilities.tokenCount import tokenCount

with open(os.path.join('AIFiles','info.json'), 'r') as f:
    data = json.load(f)
    openai.api_key = data.get('api_key', None)

fs = pd.DataFrame()

def max_cosine_sim(embeddings,prompt_embedding):
    y = 0
    for x in embeddings:
        y = max(y,cosine_similarity(x,prompt_embedding))
    return y

def filter_functions(result_string, code_query, filepaths):
    task = "List the file paths that will be required to answer the user query based on above given file summaries. if user is talking about specific file paths, only return those"

    filter_prompt = result_string + "\nUser Query: " + code_query + "\n" + task

    response_functions = AskGPT(model = "gpt-3.5-turbo", system_message = "", prompt=filter_prompt, temperature=0, max_tokens=200)

    files  = []
    for i in filepaths:
        #find i in response_functions using regex
        if re.search(i, response_functions):
            files.append(i)

    return files

def search_functions(code_query):
    prompt_embedding = get_embedding(code_query)

    fs['similarities'] = fs.embedding.apply(lambda x: max_cosine_sim(x, prompt_embedding))
    res = fs.sort_values('similarities', ascending=False).head(10)

    res.index = range(1, len(res) + 1)
    # Concatenate filenames, summary columns
    file_summary_string = []
    for index, row in res.iterrows():
        file_path = row['file_path']
        summary = row['summary']
        if summary != "Ignore":
            file_summary = 'File path: ' + str(file_path) +"\nFile summary: " +summary
            file_summary_string.append(file_summary)
        else:
            file_summary_string.append('File path: ' + file_path)
    # Convert the concatenated list to a single string
    result_string = '\n\n'.join(file_summary_string)
    #print(result_string)
    filepaths = res['file_path'].tolist()
    return filter_functions(result_string, code_query, filepaths)

def files2str(files):
    if len(files) == 0:
        return ""

    files_str = "References : \n"
    for i in files:
        #find the filename from the path
        filename = i.split("/")[-1]
        files_str += filename + " \n"

    #remove last newline
    files_str = files_str[:-1]
    return files_str


def Ask_AI(prompt):
    if prompt.strip() == "":
        return {'files': "", 'response': "Please enter a query"}

    global fs
    path = read_info()
    filename  = "AIFiles/" "fs_"+path.split('/')[-1]+".csv"
    fs = pd.read_csv(filename)
    fs['embedding'] = fs.embedding.apply(lambda x: str2float(str(x)))
    log("Analyzing your query...")
    files = search_functions(prompt)
    log("Analyzing files: " + str(files))
    print(files)
    final_prompt = ""

    estimated_tokens = 0
    for i in files:
        path = read_info()
        j = os.path.join(path,i)
        with open(j, 'rb') as f:
            result = chardet.detect(f.read())
            if result['encoding'] == 'ascii' or result['encoding'] == 'ISO-8859-1':
                final_contents = open(j).read()
                final_contents = re.sub(r'\s+', ' ', final_contents)
                estimated_tokens += tokenCount(final_contents)

    if estimated_tokens > 3000:
        for file in  files:
            final_prompt+= "\nFile path " + file + ":\n"
            final_prompt += fs['summary'][fs['file_path'] == file].values[0]
        system_message = "Act like are a coding assistant with access to the summary of files containing code. Ask for more context if required. Assume context when you can."

        print("Estimated tokens: "+str(estimated_tokens))
        print("Final Prompt : "+ final_prompt)
    else:
        for i in files:
            final_prompt += "\nFile path " + i + ":\n"
            path = read_info()

            j = os.path.join(path,i)
            with open(j, 'rb') as f:
                result = chardet.detect(f.read())
                if result['encoding'] == 'ascii' or result['encoding'] == 'ISO-8859-1':
                    final_contents = open(j).read()
                    final_contents = re.sub(r'\s+', ' ', final_contents)
                    final_prompt += final_contents
        system_message = "Act like you are a coding assistant with access to the codebase. Ask for more context if required. Assume context when you can."


    final_prompt +="\n"+prompt
    log("Asking ChatGPT-3...")
    tokens = tokenCount(final_prompt)
    max =  4000 - tokens
    log("Total Tokens in the query: "+str(tokens))
    print("Total Tokens in the query: "+str(tokens))
    log("Max tokens allowed: "+str(max))
    print("Max tokens allowed: "+str(max))
    log("Asking ChatGPT-3...")
    print("Asking ChatGPT-3...")
    FinalAnswer = AskGPT(model = "gpt-3.5-turbo", system_message = system_message, prompt=final_prompt, temperature=0, max_tokens=max)

    clear_logs()

    return {'files': files2str(files), 'response': FinalAnswer}
