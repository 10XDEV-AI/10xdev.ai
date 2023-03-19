import openai
import pandas as pd
import subprocess
from openai.embeddings_utils import cosine_similarity
#import syncAI from syncup

df = pd.read_csv('df.csv')
df2 = pd.read_csv('df2.csv')
df['code_embedding'] = df.code_embedding.apply(lambda x: [float(y) for y in x[1:-1].split(",")])

def get_embedding(prompt):
    response = openai.Embedding.create(
        input=prompt,
        model="text-embedding-ada-002"
    )
    return response['data'][0]['embedding']


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
    return df2.iloc[0]['Code']

def suggest_changes(prompt):
    code_block = get_old_code(prompt)
    syncup()
    response=openai.ChatCompletion.create(
      model="gpt-3.5-turbo",
      messages=[
            {"role": "system", "content": "You are a coding assistant."},
            {"role": "user", "content": code_block+prompt}
        ]
    )

    new_code_block = response["choices"][0]["message"]['content']
    #print(new_code_block)
    return new_code_block

def Ask_AI(prompt):
    text_file = open("API_key.txt", "r")
    #read whole file to a string
    openai.api_key =  text_file.read()
    #close file
    text_file.close()

    df3 = pd.DataFrame()
    return suggest_changes(prompt)