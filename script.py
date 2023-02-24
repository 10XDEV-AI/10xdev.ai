import openai
import subprocess
import pandas as pd
import fileinput
import numpy
import matplotlib
import random
from openai.embeddings_utils import cosine_similarity

text_file = open("API_key.txt", "r")

#read whole file to a string
openai.api_key =  text_file.read()

#close file
text_file.close()

df = pd.read_csv('code_search_line_embeddings.csv')
df2 = pd.read_csv('df2.csv')
df3 = pd.DataFrame()
df['code_embedding'] = df.code_embedding.apply(lambda x: [float(y) for y in x[1:-1].split(",")])

def get_embedding(task):
    response = openai.Embedding.create(
        input=task,
        model="text-embedding-ada-002"
    )
    return response['data'][0]['embedding']

def replace(filename, start,stop, new_code_block):
    # Read in the contents of the file
    with open(filename, 'r') as file:
        lines = file.readlines()

    # Delete the lines between start_index and stop_index
    del lines[start:stop+1]

    # Insert the new_code_block at start_index
    lines[start:stop] = new_code_block

    # Write the modified contents back to the file
    with open(filename, 'w') as file:
        file.writelines(lines)

def search_functions(code_query):
    embedding = get_embedding(code_query)
    df['similarities'] = df.code_embedding.apply(lambda x: cosine_similarity(x, embedding))
    res = df.sort_values('similarities', ascending=False).head(round(0.05*len(df)))
    return res
def count_lines(filepath, start, stop):
    count = 0
    global df3
    for i in df3[df3['filepath'] == filepath]['LineNumber']:
        for j in i:
            if(j>=start and j<stop):
                count +=1
    return count
def get_old_code(task):
    res = search_functions(task)
    global df2
    df2['Hits'] = 0
    global df3
    df3 = res.groupby("filepath").agg({"LineNumber": list}).reset_index()
    # apply the function to each row of df2 and create a new column

    df2['Hits'] = df2.apply(lambda row: count_lines(row['filepath'], row['BlockStart'], row['BlockStop']), axis=1)
    df2 = df2.sort_values('Hits', ascending=False)
    return df2
def make_changes(task):
    res = get_old_code(task)
    code_block = res.iloc[0]['Code']
    #code_block = ""
    print(code_block)

    response=openai.Edit.create(
      model="code-davinci-edit-001",
      input=code_block,
      instruction=task
    )
    new_code_block = response["choices"][0]["text"]

    # Open the file in write mode
    filename = res.iloc[0]['filepath']
    start= res.iloc[0]['BlockStart']
    stop = res.iloc[0]['BlockStop']
    replace(filename,start,stop,new_code_block)
    return "Task completed successfully."

def is_not_git_branch(branch_name):
    try:
        output = subprocess.check_output(['git', 'rev-parse', '--verify', branch_name])
        return False
    except subprocess.CalledProcessError:
        return True
def branch_out(task_id):
    if(is_not_git_branch(task_id)):
        cmd = "git checkout -b " + task_id
        subprocess.call(cmd.split(), shell=False)
    print("On branch :" + task_id)
def push():
    cmd = "git add ."
    subprocess.call(cmd.split(), shell=False)
    cmd = "git commit -m " + task_id
    subprocess.call(cmd.split(), shell=False)
    cmd = "git push --set-upstream origin " + task_id
    subprocess.call(cmd.split(), shell=False)

#task = "OTP Input Placeholder"
#make_changes(task)

#task_id = input("Enter Task ID for branch name: ")
#branch_out(task_id)
#retrain = input("Would you like to retrain the model? [y/n] :")


end = 0
while(end == 0):
    task = input("Describe a change you would want to be implemented : ")
    if task == "end":
        end = 1
        break
    make_changes(task)

#push_flag =  input("Push changes? [y/n] ")

if push_flag=="y":
    push()

if (input("Go to main[y/n]") =="y"):
    branch_out("main")

