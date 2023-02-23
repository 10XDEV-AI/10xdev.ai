import openai
import subprocess
import pandas as pd
import fileinput

text_file = open("API_key.txt", "r")

#read whole file to a string
openai.api_key =  text_file.read()

#close file
text_file.close()

df = pd.read_csv('code_search_embeddings.csv')
df['code_embedding_vector'] = df.code_embedding.apply(lambda x: [float(y) for y in x[1:-1].split(",")])

def get_embedding(task):
    response = openai.Embedding.create(
        input=task,
        model="text-embedding-ada-002"
    )
    return response['data'][0]['embedding']

def replace(filename, startStop, new_code_block):
    startStop = eval(startStop)
    # Read in the contents of the file
    with open(filename, 'r') as file:
        lines = file.readlines()

    # Delete the lines between start_index and stop_index
    del lines[startStop[0]-1:startStop[1]+1]

    # Insert the new_code_block at start_index
    lines[startStop[0]:startStop[0]] = new_code_block

    # Write the modified contents back to the file
    with open(filename, 'w') as file:
        file.writelines(lines)

def search_functions(df, code_query):
    from openai.embeddings_utils import cosine_similarity
    embedding = get_embedding(code_query)
    #print(type(embedding))
    #cosine_similarity(embedding, embedding)
    df['similarities'] = df.code_embedding.apply(lambda x: cosine_similarity(x, embedding))
    res = df.sort_values('similarities', ascending=False).head(1)
    return res

def make_changes(task):
    embedding = get_embedding(task)
    from openai.embeddings_utils import cosine_similarity
    #print(df.head)
    df['similarities'] = df.code_embedding_vector.apply(lambda x: cosine_similarity(x, embedding))
    res = df.sort_values('similarities', ascending=False).head(1)
    code_block = res.iloc[0]['Code']
    print(code_block)

    response=openai.Edit.create(
      model="code-davinci-edit-001",
      input=code_block,
      instruction=task
    )
    new_code_block = response["choices"][0]["text"]

    # Open the file in write mode
    filename = res.iloc[0]['filepath']
    startStop = res.iloc[0]['BlockStartStop']
    replace(filename,startStop,new_code_block)
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


#task = "Make Submit Button Red"
task_id = input("Enter Task ID for branch name: ")
branch_out(task_id)

#retrain = input("Would you like to retrain the model? [y/n] :")
end = 0
while(end == 0):
    task = input("Describe a change you would want to be implemented : ")
    if task == "end":
        end = 1
        break
    make_changes(task)

push_flag =  input("Push changes? [y/n] ")

if push_flag=="y":
    push()

if (input("Go to main[y/n]") =="y"):
    branch_out("main")
