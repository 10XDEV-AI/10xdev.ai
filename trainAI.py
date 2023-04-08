import openai
import os
import pandas as pd
import time
import json
import numpy as np
import matplotlib
from openai.embeddings_utils import cosine_similarity
import shutil
import chardet
import re
from gitignore_parser import parse_gitignore

text_file = open("API_key.txt", "r")

def create_clone(path):
    # Remove folder if it exists
    if os.path.exists("AIFiles"):
        #print("Removing AIFiles folder")
        shutil.rmtree("AIFiles")
    # Copy everything in path to AIFiles
       # Copy everything in path to AIFiles
    shutil.copytree(path, "AIFiles")

replace_list = ["," , "(", ")", "[", "]", "{", "}",
                  ":", ";", "!", "?", "/", "\\", "'", '"',
                  ">", "<", "=", "+", "-", "*", "&", "^", "%",
                    "$", "#", "@", "~", "`", "|", "1", "2",
                    "3","4", "5", "6", "7", "8", "9", "0",
                     "\n"]

def clean_code(x):
    global replace_list
    for i in replace_list:
        x = x.replace(i, " ").lstrip()
    x = re.sub(r'\s+', ' ',x)
    return x

def get_embedding(task,delay):
    time.sleep(delay)
    if(task=="" or task==None):
        return 0
    response = openai.Embedding.create(
            input=task,
            model="text-embedding-ada-002"
        )
    return response['data'][0]['embedding']

def split_file(filename,blocks):
    with open(filename, 'r') as f:
        lines = f.readlines()

    start_line = 0
    prev_end_line = -2
    prev_line=" "
    for i, line in enumerate(lines):
        if  line[0]!=" " and (len(prev_line.replace(" ", "").replace("\t", ""))==1) :
            stripped_line = line.replace(" ", "").replace("\t", "")
            prev_end_line = i
            extracted_lines = lines[start_line:prev_end_line]

            # join the extracted lines into a string
            extracted_text = "".join(extracted_lines)
            if extracted_text != "":
                blocks.append([filename,start_line,prev_end_line,extracted_text])
            #print(filename)

            start_line = i
        prev_line=line
    extracted_lines = lines[prev_end_line:len(lines)]
    # join the extracted lines into a string
    extracted_text = "".join(extracted_lines)
    if prev_end_line==-2:
        prev_end_line=0
    blocks.append([filename,prev_end_line,len(lines),extracted_text])
    return blocks

def walk_and_analyze(path):
    file_paths_details = []
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
                print("Analyzing : "+os.path.join(root, filename))
                #time.sleep(1)
                with open(os.path.join(root, filename), 'rb') as f:
                    result = chardet.detect(f.read())
                    #print(result['encoding'])
                if result['encoding'] == 'ascii':
                    file_paths_details.append(os.path.join(root, filename))
    return file_paths_details


def train_AI(path):
    print("Training AI")
    #store path into info.json
    data = {
        'path': path
    }
    with open('info.json', 'w') as outfile:
        json.dump(data, outfile)

    file_paths_details = walk_and_analyze(path)
    print("Total number of files analyzed:", len(file_paths_details))
    #print(file_paths_details)
    df4 = pd.DataFrame(file_paths_details)
    df4.columns = ["filepath"]
    #create a new column that has last synced time
    df4['avg_line_length'] = df4.apply(lambda row: np.mean([len(i) for i in open(row['filepath'], 'r').readlines()]), axis=1)
    df4.to_csv("df4.csv", index=False)

    text_file = open("API_key.txt", "r")
    openai.api_key =  text_file.read()
    text_file.close()

    line_embeddings = []
    blocks = []

    for i in range(0,len(df4)):
        filename = df4.iloc[i][0]
        with open(filename, 'r') as f:
                #print(filename)
                lines = f.readlines()
                line_number = 0
                for j in lines:
                    line_embeddings.append([filename,j,line_number])
                    line_number +=1
        blocks= (split_file(df4.iloc[i][0],blocks))

    print("Total number of functions extracted:", len(blocks))

    df = pd.DataFrame(line_embeddings)
    df2 = pd.DataFrame(blocks)
    df2.columns = ["filepath","BlockStart","BlockStop","Code"]
    df.columns = ["filepath","Code","LineNumber"]
    #df['Block_Number'] = df.apply(lambda row: df2[(df2['filepath']==row['filepath']) & (df2['BlockStart']<=row['LineNumber']) & (df2['BlockStop']>row['LineNumber'])].index[0], axis=1)

    #df["code_group"] = df.Code.apply(lambda x : "short" if ( len(x.lstrip()) < 10 ) else "long")
    #df = df.groupby(["filepath", "Block_Number", "code_group"]).agg({"Code": " ".join, "LineNumber": "min"}).reset_index()
    df['code_embedding'] = ''
    df['Code'] = df.Code.apply(lambda x : clean_code(x))

    #df = df[df.Code != ''].reset_index(drop=True)
    #drop columns that are not needed
    #df = df.drop(columns=['Block_Number','code_group'])
    i=0
    rate_limit = 60
    start_time = time.time()
    delay = 60/rate_limit
    for ind in df.index:
            df['code_embedding'][ind] = get_embedding(df['Code'][ind],delay)
            if df['code_embedding'][ind] != 0:
                i+=1
                rate = 60*i/(time.time() - start_time)
                time_elapsed = time.time() - start_time
                print(str(round(100*ind/len(df))) + "% done. Rate: " + str(round(rate,2)) + " requests/min. Time Elapsed: " +str(time_elapsed) + " seconds Time remaining: " + str(round((len(df)-i)/rate)) + " minutes")
                if rate > rate_limit:
                    delay = delay + 0.1
                    #print("Rate limit reached. Delay increased to " + str(delay) + " seconds")
                if rate < 0.95*rate_limit:
                    delay = delay * 0.9
                    #print("Rate limit not reached. Delay decreased to " + str(delay) + " seconds")

    create_clone(path)
    print("Done")
    df.to_csv("df.csv", index=False)
    df2.to_csv("df2.csv", index=False)