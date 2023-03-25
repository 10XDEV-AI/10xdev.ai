import openai
import os
import pandas as pd
import time
import json
import numpy
import matplotlib
from openai.embeddings_utils import cosine_similarity
import shutil

text_file = open("API_key.txt", "r")

def create_clone(path):
    # Remove folder if it exists
    if os.path.exists("AIFiles"):
        shutil.rmtree("AIFiles")
    # Create folder
    os.mkdir("AIFiles")
    # Copy everything in path to AIFiles
    for filename in os.listdir(path):
        src = os.path.join(path, filename)
        dst = os.path.join("AIFiles", filename)
        shutil.copy(src, dst)

def get_embedding(task):
    time.sleep(2)
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

def train_AI(path):
    print("Training AI")
    #store path into info.json
    data = {
        'path': path
    }
    with open('info.json', 'w') as outfile:
        json.dump(data, outfile)

    create_clone(path)
    file_paths_details = []
    Files_to_ignore = open(path+"/.AIIgnore", "r").read().splitlines()
    print("Files and directories to ignore:")
    print(Files_to_ignore)

    for root, directories, files in os.walk(path):
        # Exclude any directories that appear in the ignore list
        directories[:] = [d for d in directories if d not in Files_to_ignore]
        print("Directories:", directories)
        for filename in files:
            if filename not in Files_to_ignore:
                print(filename)
                # Append the path to each file to the file_paths list
                file_paths_details.append(os.path.join(root, filename))
    df4 = pd.DataFrame(file_paths_details)
    df4.columns = ["filepath"]
    #create a new column that has last synced time
    df4.to_csv("df4.csv", index=False)

    text_file = open("API_key.txt", "r")
    openai.api_key =  text_file.read()
    text_file.close()

    line_embeddings = []
    blocks = []

    for i in range(0,len(df4)):
        filename = df4.iloc[i][0]
        with open(filename, 'r') as f:
                lines = f.readlines()
                line_number = 0
                for j in lines:
                    line_embeddings.append([filename,j,line_number])
                    line_number +=1
        blocks= (split_file(df4.iloc[i][0],blocks))

    print("Total number of functions extracted:", len(blocks))

    df = pd.DataFrame(line_embeddings)
    df2 = pd.DataFrame(blocks)
    df.columns = ["filepath","Code","LineNumber"]
    df2.columns = ["filepath","BlockStart","BlockStop","Code"]

    df['code_embedding'] = ''

    i=0
    for ind in df.index:
            i+=1
            df['code_embedding'][ind] = get_embedding(df['Code'][ind])
            print(round(100*i/len(df)))
    print("Done")
    df.to_csv("df.csv", index=False)
    df = pd.read_csv('df.csv')
    df['code_embedding'] = df.code_embedding.apply(lambda x: [float(y) for y in x[1:-1].split(",")])
    # apply the function to each row of df2 and create a new column
    df2.to_csv("df2.csv", index=False)