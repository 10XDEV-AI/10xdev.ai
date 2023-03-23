import subprocess
import json
import os
import pandas as pd
import openai
import time
import numpy
import shutil
from trainAI import get_embedding,split_file,create_clone
text_file = open("API_key.txt", "r")
openai.api_key =  text_file.read()
text_file.close()

df = pd.read_csv('df.csv')
df4 = pd.read_csv('df4.csv')

def get_diff(old_file_path, new_file_path):
    result = subprocess.run(["diff", old_file_path, new_file_path], capture_output=True, text=True)
    return result.stdout

def parse_patch(patch_string):
    lines = patch_string.split("\n")
    commands = []
    i=0
    j=0
    lines = [line for line in patch_string.split("\n") if not line.startswith("\\")]
    while (i < len(lines)-1):
        #print("Ho")
        #print(lines[i][0])
        if(lines[i][0] not in['>','<',"\\",'-']):
            print("Command = " + lines[i])
            j=i+1
            #print(j)
            if lines[i].find("a") > 0:
                cmd = int(lines[i].split("a")[0])
                if lines[i].find(",")>0:
                    new_line_numbers = tuple(map(int, lines[i].split("a")[1].split(",")))
                    count = new_line_numbers[1]-new_line_numbers[0]
                    #print(count)
                    new_lines = lines[i+1:i+count+2]
                    for k in range(len(new_lines)):
                        new_lines[k] = new_lines[k][1:]
                    command = ("add", cmd, new_line_numbers,new_lines)
                    #print(command)
                else:
                    new_line_numbers = (int(lines[i].split("a")[1]),int(lines[i].split("a")[1]))
                    new_lines = lines[i+1:i+2]
                    for k in range(len(new_lines)):
                        new_lines[k] = new_lines[k][2:]
                    command = ("add", cmd, new_line_numbers,new_lines)
                    #print(command)
            elif lines[i].find("c") > 0:
                cmd = lines[i].split("c")
                pre = cmd[0]
                post = cmd[1]
                new_count=0
                old_count=0

                if pre.find(",")>0:
                    old_line_numbers = tuple(map(int, lines[i].split("c")[0].split(",")))
                    old_count = old_line_numbers[1]-old_line_numbers[0]+1
                    #old_lines = lines[i+1:i+old_count+1]
                else:
                    old_line_numbers = (int(pre),int(pre))
                    #print(type(old_line_numbers))
                    old_count=1
                    #old_lines = lines[i+1:i+old_count+2]

                if post.find(",")>0:
                    #print("Pre = ")
                    #print(pre)
                    new_line_numbers = tuple(map(int, lines[i].split("c")[1].split(",")))
                    new_count = new_line_numbers[1]-new_line_numbers[0]+1
                    #new_lines = lines[i+1:i+new_count+2]
                else:
                    new_line_numbers = (int(post),int(post))
                    new_count=1
                    #new_lines = lines[i+1:i+new_count+1]

                old_lines = [line[2:] for line in lines[i+1:i+old_count+1]]
                new_lines = [line[2:] for line in lines[i+old_count+2:i+old_count+new_count+2]]
                command = ("change", old_line_numbers, new_line_numbers,old_lines,new_lines)
                #print(command)
            elif lines[i].find("d") > 0:
                cmd = lines[i].split("d")[0]
                old_line_numbers = tuple(map(int, lines[i].split("d")[0].split(",")))
                count = old_line_numbers[1]-old_line_numbers[0]
                #print(count)
                command = ("del", old_line_numbers)
                #print(command)

            commands.append(command)
            while((j<len(lines)-1) and lines[j][0] in ['>','<',"\\",'-']):
                #print(str(j-i)+" |"+lines[j])
                j+=1
            #print(" ")
        i=j
    return commands


def get_clone_path(path):
    # split the path by '/'
    path_parts = path.split('/')

    # get the index of "repo"
    repo_index = path_parts.index("repo")

    # replace "repo" with "AIFiles" in the path and join the path parts back together
    new_path = "/".join(path_parts[:repo_index] + ["AIFiles"] + path_parts[repo_index+1:])

    return new_path

def read_info():
    # Open the info.json file and load its contents into a Python dictionary
    with open('info.json') as f:
        data = json.load(f)

    # Get the home_path value from the dictionary
    path = data['path']
    return path

def add2df(filename, location, new_rows):
    """
    Adds new rows to a dataframe between the start and end indices.
    """
    global df
    print(len(df))
    new_df = pd.DataFrame(new_rows,columns=['Code'])
    new_df['LineNumber'] = 0
    new_df['code_embedding'] = new_df['Code'].apply(get_embedding)
    new_df['filepath'] = filename
    # Append the new_df to the original DataFrame at the given location index
    df = pd.concat([df.iloc[:location], new_df, df.iloc[location:]])

    # Display the new_df
    print(len(df))
    #display(df[df['filepath']==filename])
    return


def delfromdf(filename, start, end):
    """
    Deletes rows from a dataframe between the start and end indices.
    """
    global df
    df = df.drop(df.index[start:end+1])
    #display(df[df['filepath']==filename])
    return

def changedf(filename, old_start, old_end, new_start, new_end, new_rows):
    """
    Replaces rows in a dataframe between old_start and old_end with new_lines,
    which are inserted between new_start and new_end.
    """
    global df
    new_df = pd.DataFrame(new_rows,columns=['Code'])
    new_df['LineNumber'] = 0
    new_df['code_embedding'] = None
    new_df['filepath'] = filename
    df = df.drop(df.index[old_start:old_end-1])
    df = pd.concat([df.iloc[:old_start], new_df, df.iloc[old_end:]])
    #display(df[df['filepath']==filename])
    return

def apply_patch(filename,patch):
    commands = parse_patch(patch)
    print("Applying Patch for :" + filename)
    for command in commands:
        if command[0]=='change':
            print("Change")
            changedf(filename,command[1][0],command[1][1],command[2][0],command[2][1],command[4])
            print(command)
        elif command[0]=='add':
            print("Adding")
            add2df(filename,command[1],command[3])
        elif (command[0]=='del'):
            print("Delete")
            delfromdf(filename,command[1][0],command[1][1])
    return

def syncAI():
    global df4
    global df
    path = read_info()
    #print("Syncing AI :")
    file_paths_details = []
    Files_to_ignore = open(path+"/.AIIgnore", "r").read().splitlines()
    #print("Files and directories to ignore:")
    #print(Files_to_ignore)

    for root, directories, files in os.walk(path):
            # Exclude any directories that appear in the ignore list
            directories[:] = [d for d in directories if d not in Files_to_ignore]
            #print("Directories:", directories)
            for filename in files:
                if filename not in Files_to_ignore:
                    #print(filename)
                    # Append the path to each file to the file_paths list
                    file_paths_details.append(os.path.join(root, filename))

    # Find the set difference between file_paths_details and df4["filepath"]
    new_file_paths = set(file_paths_details) - set(df4["filepath"])
    # Iterate over the new_file_paths set and create a new row for each file path
    new_rows = []
    for file_path in new_file_paths:
        # Create a dictionary with the values for each column in the new row
        row_dict = {
            "filepath": file_path
            # Add any other columns you need for the new row
        }
        # Append the new row to the new_rows list
        new_rows.append(row_dict)
        print("New File : "+file_path)

    # Convert the new_rows list of dictionaries to a pandas DataFrame
    new_df = pd.DataFrame(new_rows)
    df4 = pd.concat([df4, new_df], ignore_index=True)
    del_file_paths = set(df4["filepath"]) - set(file_paths_details)

    # Iterate over the del_file_paths set and remove the corresponding rows from dataframes
    for file_path in del_file_paths:
        df4 = df4[df4["filepath"] != file_path]
        df2 = df2[df2["filepath"] != file_path]
        df = df[df["filepath"] != file_path]
        print("Deleted File : "+file_path)

    for ind in df4.index:
        #print(df4['filepath'][ind])
        diff= get_diff(get_clone_path(df4['filepath'][ind]),df4['filepath'][ind])
        print(diff)
        apply_patch(df4['filepath'][ind],diff)

    df['LineNumber'] = df.groupby('filepath').cumcount()

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

    df2 = pd.DataFrame(blocks)
    df2.columns = ["filepath","BlockStart","BlockStop","Code"]

    create_clone(read_info())

    df4.to_csv("df4.csv", index=False)
    df2.to_csv("df2.csv", index=False)
    df.to_csv("df.csv", index=False)
    return