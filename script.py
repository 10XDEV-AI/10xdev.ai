import openai
import subprocess
import pandas as pd
import fileinput

#task = "Make Submit Button Red"
task = input("Describe a change you would want to be implemented : ")
task_id = input("Enter Task ID for branch name: ")
#retrain = input("Would you like to retrain the model? [y/n] :")

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

def replace(filename,startStop,new_code_block):
    # Create a backup of the original file
    '''
    backup_filename = filename + ".bak"
    with open(filename, 'r') as f_in, open(backup_filename, 'w') as f_out:
        f_out.writelines(f_in)

    '''
    # Replace the specified lines with the new code block
    startStop = eval(startStop)
    with fileinput.input(filename, inplace=True) as f:
        for i, line in enumerate(f, 1):
            if startStop[0] <= i <= startStop[1]:
                if i == startStop[0]:
                    print(new_code_block, end='')
            else:
                print(line, end='')
    return
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
    #print(code_block)

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

branch_out(task_id)
make_changes(task)
push()

if input("Go to main[y/n]" =="y"):
    branch_out("main")
