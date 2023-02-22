import openai
import pandas as pd

openai.api_key = input("API Key")

split_files = []

file_paths_details = [
    "index.html",
    "style.css",
    "login-page.js"
]

comment_chars = [
    "<!-",
    "/*",
    "//"
]

def split_file_by_character(filename, character):
    with open(filename, 'r') as f:
        lines = f.readlines()

    start_line = 0
    prev_end_line = -1
    for i, line in enumerate(lines):
        if character in line:
            prev_end_line = i
            extracted_lines = lines[start_line:prev_end_line]

            # join the extracted lines into a string
            extracted_text = "".join(extracted_lines)
            if extracted_text != "":
                split_files.append([filename,(start_line,prev_end_line),extracted_text])
            #print(filename)
            start_line = i + 1

    extracted_lines = lines[prev_end_line+1:len(lines)]
    # join the extracted lines into a string
    extracted_text = "".join(extracted_lines)
    split_files.append([filename,(prev_end_line+1,len(lines)),extracted_text])

    return

for i in range(0,len(file_paths_details)):
    parts = split_file_by_character(file_paths_details[i],comment_chars[i])

print("Total number of functions extracted:", len(split_files))

df = pd.DataFrame(split_files)
df.columns = ["filepath","BlockStartStop","Code"]
#display(df)


def get_embedding(task):
    response = openai.Embedding.create(
        input=task,
        model="text-embedding-ada-002"
    )
    return response['data'][0]['embedding']

df['code_embedding'] = df['Code'].apply(lambda x: get_embedding(x))
df.to_csv("code_search_embeddings.csv", index=False)
