import pandas as pd
import regex as re
import os, openai, time
import chardet
from utilities.embedding import get_embedding
from openai.embeddings_utils import cosine_similarity
from utilities.projectInfo import read_info
from utilities.str2float import str2float
from utilities.AskGPT import AskGPT
from utilities.tokenCount import tokenCount
from utilities.keyutils import get_key

fs = pd.DataFrame()

def max_cosine_sim(embeddings,prompt_embedding):
    y = 0
    for x in embeddings:
        y = max(y,cosine_similarity(x,prompt_embedding))
    return y

def filter_functions(result_string, code_query, filepaths,email):
    task = "List the file paths that will be required to answer the user query based on above given file summaries. if user is talking about specific file paths, only return those"

    filter_prompt = result_string + "\nUser Query: " + code_query + "\n" + task

    response_functions = AskGPT(email,model = "gpt-3.5-turbo", system_message = "", prompt=filter_prompt, temperature=0, max_tokens=200)

    files  = []
    for i in filepaths:
        #find i in response_functions using regex
        if re.search(i, response_functions):
            files.append(i)

    return files

def search_functions(code_query,email):
    prompt_embedding = get_embedding(code_query,email)

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
    return filter_functions(result_string, code_query, filepaths,email)

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
def get_referenced_code(path, files):
    referenced_code = []

    for file in files:
        file_path = os.path.join(path, file)
        try:
            with open(file_path, 'r') as f:
                code = f.read()
                code_block = f"{file}\n{code}"
                referenced_code.append(code_block)
        except Exception as e:
            print("Error opening file:", file_path)
            print("Error message:", str(e))

    return referenced_code


def Ask_AI(prompt,userlogger,email):
    if prompt.strip() == "":
        return {'files': "", 'response': "Please enter a query", 'referenced_code': None}

    global fs
    path = read_info(email)
    if path == "":
        return {'files': "", 'response': "You have not selected any repos, please open settings ⚙️ and set repo"}
    filename = email+"/AIFiles/"+path.split('/')[-1]+".csv"
    fs = pd.read_csv(filename)
    fs['embedding'] = fs.embedding.apply(lambda x: str2float(str(x)))
    userlogger.log("Analyzing your query...")
    files = search_functions(prompt,email)

    referenced_code = get_referenced_code(path,files)
    # print("Referenced code: ", referenced_code)
    userlogger.log("Analyzing files: " + str(files))
    print(files)
    final_prompt = ""

    estimated_tokens = 0
    for i in files:
        path = read_info(email)
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

        print("Estimated tokens: "+str(estimated_tokens))
        print("Final Prompt : "+ final_prompt)
    else:
        for i in files:
            final_prompt += "\nFile path " + i + ":\n"
            path = read_info(email)

            j = os.path.join(path,i)
            with open(j, 'rb') as f:
                result = chardet.detect(f.read())
                if result['encoding'] == 'ascii' or result['encoding'] == 'ISO-8859-1':
                    final_contents = open(j).read()
                    final_contents = re.sub(r'\s+', ' ', final_contents)
                    final_prompt += final_contents
        system_message = "Act like you are a coding assistant with access to the codebase."


    final_prompt +="\n"+prompt
    tokens = tokenCount(final_prompt)
    max =  4000 - tokens
    userlogger.log("Total Tokens in the query: "+str(tokens))
    print("Total Tokens in the query: "+str(tokens))

    userlogger.log("Asking ChatGPT-3...")
    print("Asking ChatGPT-3...")
    FinalAnswer = AskGPT(email,model = "gpt-3.5-turbo", system_message = system_message, prompt=final_prompt, temperature=0, max_tokens=max)
    last_ask_time=time.time()
    userlogger.clear_logs()

    return {'files': files2str(files), 'response': FinalAnswer,'referenced_code': referenced_code}
