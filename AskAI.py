import pandas as pd
import regex as re
import os
import chardet
from utilities.embedding import split_embed
from openai.embeddings_utils import cosine_similarity
from utilities.notebook_utils import convert_ipynb_to_python
from utilities.logger import UserLogger
from utilities.projectInfo import read_info
from utilities.str2float import str2float
from utilities.AskGPT import AskGPT
from utilities.tokenCount import tokenCount

fs = pd.DataFrame()


def max_cosine_sim(embeddings, prompt_embedding):
    y = 0
    for i in prompt_embedding:
        for x in embeddings:
            y = max(y, cosine_similarity(x, i))
    return y


def filter_functions(result_string, code_query, filepaths, email, userlogger):
    task = "List the file paths that will be required to answer the current user prompt based on above given file summaries. if user is talking about specific file paths, only return those"

    filter_prompt = result_string + "\nUser Query: " + code_query + "\n" + task

    response_functions = AskGPT(email, system_message="", prompt=filter_prompt, temperature=0, max_tokens=200)
    # userlogger.log(response_functions)
    files = []
    for i in filepaths:
        # find i in response_functions using regex
        if re.search(i, response_functions):
            files.append(i)

    return files


def search_functions(code_query, email, userlogger, scope):
    global fs
    prompt_embedding = split_embed(code_query, email)

    fs['similarities'] = fs.embedding.apply(lambda x: max_cosine_sim(x, prompt_embedding) if x is not None else 1)
    if scope is not None:
        files_in_scope = []
        for file in scope:
            if fs['file_path'].str.contains(file).any():
                files_in_scope.append(fs[fs['file_path'].str.contains(file)]['file_path'].tolist()[0])
        if len(files_in_scope) > 0:
            fs = fs[fs['file_path'].isin(files_in_scope)]

    res = fs.sort_values('similarities', ascending=False).head(10)

    res.index = range(1, len(res) + 1)
    # Concatenate filenames, summary columns
    file_summary_string = []
    for index, row in res.iterrows():
        file_path = row['file_path']
        summary = row['summary']
        if summary != "Ignore":
            file_summary = 'File path: ' + str(file_path) + "\nFile summary: " + summary
            file_summary_string.append(file_summary)
        else:
            file_summary_string.append('File path: ' + file_path)
    # Convert the concatenated list to a single string
    result_string = '\n\n'.join(file_summary_string)
    # print(result_string)
    filepaths = fs['file_path'].tolist()
    return filter_functions(result_string, code_query, filepaths, email, userlogger)


def files2str(files):
    if len(files) == 0:
        return ""

    files_str = "References : \n"
    for i in files:
        # find the filename from the path
        filename = i.split("/")[-1]
        files_str += filename + " \n"

    # remove last newline
    files_str = files_str[:-1]
    return files_str


def get_referenced_code(path, files):
    referenced_code = []

    for file in files:
        try:
            if file.endswith(".ipynb"):
                code = convert_ipynb_to_python(os.path.join(path, file))
            else:
                with open(os.path.join(path, file), 'r') as f:
                    code = f.read()
            code_block = f"{file}\n{code}"
            referenced_code.append(code_block)
        except Exception as e:
            print("Error opening file:", file)
            print("Error message:", str(e))

    return referenced_code


def consolidate_prompt_creation(chatmessages, current_prompt):
    if chatmessages is not None:
        if len(chatmessages) == 0:
            return ""
        previous_user_prompts = []
        previous_search_results = []
        previous_files = []

        if len(chatmessages) > 3:
            chatmessages = chatmessages[-3:]

        for message in chatmessages:
            prompt = message['prompt']['searchTerm']
            search_results = message['response']['searchResults']
            files = message['response']['files']

            previous_user_prompts.append(prompt)
            previous_search_results.append(search_results)
            previous_files.append(files)  # Use extend to add all files in the list

        history_prompt = "Here is a conversation between a human and an AI code assistant\n-------\n"

        # Add previous user prompts, AI responses, and file references to the consolidated prompt
        for i, user_prompt in enumerate(previous_user_prompts):
            ai_response = previous_search_results[i]
            file_references = previous_files[i]  # Assuming each search returns 10 files

            consolidated_prompt = f"User prompt {i + 1}: {user_prompt}\n" \
                                  f"Response {i + 1}: {ai_response}\n" \
                                  f"File References {i + 1} : {file_references}\n\n"
            history_prompt += consolidated_prompt
            history_prompt += "------\n"

        # Add the current prompt to the consolidated prompt
        history_prompt += f"Current user prompt : {current_prompt}\n-----\n"

        history_prompt_old_1 = f"Task for you : Come up with a consolidated prompt to best answer user prompt {len(previous_user_prompts) + 1}. Return just the consolidated user prompt and nothing else. Do not use your own brain, just give me the user query"

        history_prompt_old_2 = f"Task for you : \n" \
                               f"1. Return 'Context': This should include exact code blocks and parts of conversation history exactly as they are, to best answer the Current user prompt.\n" \
                               f"2. Return a consolidated user prompt:  to best answer current user prompt . Return just the consolidated user prompt and nothing else. Do not use your own brain, just give me the consolidated user prompt "

        return history_prompt.strip()

    return ""


def Ask_AI(prompt, userlogger, email, chatmessages, scope):
    consolidated_prompt = consolidate_prompt_creation(chatmessages, prompt)
    if consolidated_prompt:
        prompt = consolidated_prompt

    global fs
    path = read_info(email)
    if path == "":
        return {'files': "", 'response': "You have not selected any repos, please open settings ⚙️ and set repo"}
    filename = "../user/" + email + "/AIFiles/" + path.split('/')[-1] + ".csv"
    fs = pd.read_csv(filename)
    fs['embedding'] = fs.embedding.apply(lambda x: str2float(str(x)))
    userlogger.log("Analyzing your query...")
    files = search_functions(prompt, email, userlogger, scope)

    referenced_code = get_referenced_code(path, files)
    # print("Referenced code: ", referenced_code)
    userlogger.log("Analyzing files: " + str(files))
    print("Analyzing files: " + str(files))
    final_prompt = ""

    estimated_tokens = 0
    for i in files:
        j = os.path.join(path, i)
        if i.endswith(".ipynb"):
            final_contents = convert_ipynb_to_python(j)
        else:
            final_contents = open(j).read()
        final_contents = re.sub(r'\s+', ' ', final_contents)
        estimated_tokens += tokenCount(final_contents)

    if estimated_tokens > 15000:
        for file in files:
            final_prompt += "\nFile path " + file + ":\n"
            final_prompt += fs['summary'][fs['file_path'] == file].values[0]

        print("Estimated tokens: " + str(estimated_tokens))
    else:
        for i in files:
            final_prompt += "\nFile path " + i + ":\n"
            path = read_info(email)
            j = os.path.join(path, i)
            if j.endswith(".ipynb"):
                final_contents = convert_ipynb_to_python(j)
            else:
                final_contents = open(j).read()
            final_contents = re.sub(r'\s+', ' ', final_contents)
            final_prompt += final_contents

    system_message = "Act like you are a coding assistant with access to the codebase. Try to answer the current user prompt."

    final_prompt += "\n" + "Current User Prompt: " + prompt
    # print(final_prompt)
    tokens = tokenCount(final_prompt)

    # userlogger.log("Total Tokens in the query: " + str(tokens))
    print("Total Tokens in the query: " + str(tokens))

    userlogger.log("Thinking of an answer...")
    FinalAnswer = AskGPT(email=email, system_message=system_message, prompt=final_prompt,
                         temperature=0.7)
    userlogger.clear_logs()

    return {'files': files, 'response': FinalAnswer, 'referenced_code': referenced_code}


def Ask_AI_search_files(prompt, user_logger, email, chat_messages, scope):
    global fs
    consolidated_prompt = consolidate_prompt_creation(chat_messages, prompt)
    if consolidated_prompt:
        prompt = consolidated_prompt
    path = read_info(email)
    if path == "":
        return {'files': "", 'response': "You have not selected any repos, please open settings ⚙️ and set repo"}
    filename = "../user/" + email + "/AIFiles/" + path.split('/')[-1] + ".csv"
    fs = pd.read_csv(filename)
    fs['embedding'] = fs.embedding.apply(lambda x: str2float(str(x)))
    user_logger.log("Analyzing your query...")
    files = search_functions(prompt, email, user_logger, scope)
    return {'files': files}


def Ask_AI_with_referenced_files(prompt, user_logger, email, chat_messages, referenced_files):
    consolidated_prompt = consolidate_prompt_creation(chat_messages, prompt)
    if consolidated_prompt:
        prompt = consolidated_prompt
    path = read_info(email)
    if path == "":
        return {'files': "", 'response': "You have not selected any repos, please open settings ⚙️ and set repo"}
    filename = "../user/" + email + "/AIFiles/" + path.split('/')[-1] + ".csv"
    fs = pd.read_csv(filename)
    fs['embedding'] = fs.embedding.apply(lambda x: str2float(str(x)))
    files = referenced_files
    referenced_code = get_referenced_code(path, files)
    final_prompt = ""
    estimated_tokens = 0
    for i in files:
        j = os.path.join(path, i)
        if i.endswith(".ipynb"):
            final_contents = convert_ipynb_to_python(j)
        else:
            final_contents = open(j).read()
        final_contents = re.sub(r'\s+', ' ', final_contents)
        estimated_tokens += tokenCount(final_contents)
    if estimated_tokens > 15000:
        for file in files:
            final_prompt += "\nFile path " + file + ":\n"
            final_prompt += fs['summary'][fs['file_path'] == file].values[0]
        print("Estimated tokens: " + str(estimated_tokens))
    else:
        for i in files:
            final_prompt += "\nFile path " + i + ":\n"
            path = read_info(email)
            j = os.path.join(path, i)
            if j.endswith(".ipynb"):
                final_contents = convert_ipynb_to_python(j)
            else:
                final_contents = open(j).read()
            final_contents = re.sub(r'\s+', ' ', final_contents)
            final_prompt += final_contents
    system_message = "Act like you are a coding assistant with access to the codebase. Try to answer the current user prompt."
    final_prompt += "\n" + "Current User Prompt: " + prompt + "\n Response :"
    tokens = tokenCount(final_prompt)
    print("Total Tokens in the query: " + str(tokens))
    user_logger.log("Thinking of an answer...")
    FinalAnswer = AskGPT(email=email, system_message=system_message, prompt=final_prompt, temperature=0.7)
    user_logger.clear_logs()
    return {'files': files, 'response': FinalAnswer, 'referenced_code': referenced_code}


if __name__ == "__main__":
    question = "In the 10xdev/src/Clone.js file write a new handle clone function that will handle call to backend when the user tried to clone a private repo, take the access token from there and pass it to backend, in the backend (application.py file) write a new endpoint to clone private repos just like the utilities/clone_repo.py functions"
    Ask_AI(question, userlogger=UserLogger("prathamthepro@gmail.com"), email="prathamthepro@gmail.com",
           chatmessages=None)
