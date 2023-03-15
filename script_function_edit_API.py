import openai
import pandas as pd
import subprocess
from openai.embeddings_utils import cosine_similarity

df = pd.read_csv('df.csv')
df2 = pd.read_csv('df2.csv')
df['code_embedding'] = df.code_embedding.apply(lambda x: [float(y) for y in x[1:-1].split(",")])

def get_embedding(prompt):
    response = openai.Embedding.create(
        input=prompt,
        model="text-embedding-ada-002"
    )
    return response['data'][0]['embedding']

def replace(filename, start,stop, new_code_block):
    # Read in the contents of the file
    with open(filename, 'r') as file:
        lines = file.readlines()
    # Delete the lines between start_index and stop_index
    del lines[start:stop]
    # Insert the new_code_block at start_index
    lines[start:start] = new_code_block
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

def get_old_code(prompt):
    res = search_functions(prompt)
    global df2
    df2['Hits'] = 0
    global df3
    df3 = res.groupby("filepath").agg({"LineNumber": list}).reset_index()
    # apply the function to each row of df2 and create a new column

    df2['Hits'] = df2.apply(lambda row: count_lines(row['filepath'], row['BlockStart'], row['BlockStop']), axis=1)
    df2 = df2.sort_values('Hits', ascending=False)
    return df2

def suggest_changes(prompt,new_flag):
    if(new_flag == 0):
        res = get_old_code(prompt)
        code_block = res.iloc[0]['Code']
        #code_block = ""
        #print("Old Code")
        #print(code_block)

        #print("New Code")
        response=openai.Edit.create(
          model="code-davinci-edit-001",
          input=code_block,
          instruction=prompt,
          temperature = 0.2
        )
        new_code_block = response["choices"][0]["text"]
        #print(new_code_block)
    else:
        response=openai.Edit.create(
            model="code-davinci-edit-001",
            input="",
            instruction=prompt,
            temperature = 0.2
        )
        new_code_block = response["choices"][0]["text"]
        #print(new_code_block)
        code_block = ""

    return [code_block, new_code_block]

def Ask_AI(prompt):
    text_file = open("API_key.txt", "r")

    #read whole file to a string
    openai.api_key =  text_file.read()

    #close file
    text_file.close()

    df3 = pd.DataFrame()

    if prompt.startswith('-n'):
        prompt = prompt[2:].strip()
        return suggest_changes(prompt, 1)
    else:
        return suggest_changes(prompt, 0)