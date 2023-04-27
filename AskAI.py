import pandas as pd
import regex as re
import time
import openai
import os
import chardet
from utilities.embedding import get_embedding
from openai.embeddings_utils import cosine_similarity
from utilities.readInfo import read_info
from utilities.str2float import str2float
from utilities.logger import log, get_last_logs, clear_logs

fs = pd.DataFrame()

def max_cosine_sim(embeddings,prompt_embedding):
    y = 0
    for x in embeddings:
        y = max(y,cosine_similarity(x,prompt_embedding))
    return y

def filter_functions(result_string, code_query, filepaths):
    task = "List the top one , two or three file paths that will be required to answer the user query based on above given file summaries. Do not return any filepaths if the user query is not related to any of these."

    filter_prompt = result_string + "\nUser Query: " + code_query + "\n" + task
    #print(filter_prompt)
    MAX_RETRIES = 3  # Maximum number of retries for API call
    retries = 0  # Counter for retries
    response = None  # Placeholder for API response

    while retries < MAX_RETRIES:
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": ""},
                    {"role": "user", "content": filter_prompt}
                ],
                temperature=0,
                max_tokens=500
            )
            break  # Break out of loop if API call is successful
        except Exception as e:
            print(f"Error occurred: {e}")
            print("Retrying...")
            retries += 1
            time.sleep(2)  # Add a delay before retrying

    if retries == MAX_RETRIES:
        print("Maximum retries reached. API call failed.")
    else:
        response_functions = response["choices"][0]["message"]['content']
        #print(response_functions)

    files  = []
    for i in filepaths:
        #find i in response_functions using regex
        if re.search(i, response_functions):
            files.append(i)

    return files

def search_functions(code_query):
    prompt_embedding = get_embedding(code_query, 0)

    fs['similarities'] = fs.embedding.apply(lambda x: max_cosine_sim(x, prompt_embedding))
    res = fs.sort_values('similarities', ascending=False).head(10)

    res.index = range(1, len(res) + 1)
    # Concatenate filenames, summary columns
    file_summary_string = []
    for index, row in res.iterrows():
        file_path = row['file_path']
        summary = row['summary']
        if summary != "Ignore":
            file_summary = 'File path: ' + file_path +"\nFile summary: " +summary
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
    #print(files)
    #make a string of all file content
    final_prompt = ""

    for i in files:
        final_prompt += "\nFile path " + i + ":\n"
        path = read_info()

        j = os.path.join(path,i)
        with open(j, 'rb') as f:
            result = chardet.detect(f.read())
            if result['encoding'] == 'ascii' or result['encoding'] == 'ISO-8859-1':
                final_contents = open(j).read()
                #remove extra whitespaces and newlines
                final_contents = re.sub(r'\s+', ' ', final_contents)
                final_prompt += final_contents

    final_prompt =(final_prompt+"\n"+prompt)
    log("Asking ChatGPt-3...")
    #print("Final prompt : "+ final_prompt)

    MAX_RETRIES = 3  # Maximum number of retries for API call
    retries = 0  # Counter for retries

    while retries < MAX_RETRIES:
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a coding assistant with access to the codebase. Ask for more context if required. Assume context when you can."},
                    {"role": "user", "content": final_prompt}
                ],
                temperature=0
            )
            break  # Break out of loop if API call is successful
        except Exception as e:
            print(f"Error occurred: {e}")
            print("Retrying...")
            retries += 1
            time.sleep(20)  # Add a delay before retrying

    if retries == MAX_RETRIES:
        print("Maximum retries reached. API call failed.")
        return None
    else:
        response_functions = response["choices"][0]["message"]['content']
    clear_logs()
    return {'files': files2str(files), 'response': response_functions}
