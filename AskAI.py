import pandas as pd
import regex as re
import os
from utilities.embedding import split_embed
from openai.embeddings_utils import cosine_similarity
from utilities.notebook_utils import convert_ipynb_to_python
from utilities.logger import UserLogger
from utilities.projectInfo import read_info
from utilities.str2float import str2float
from utilities.AskGPT import AskGPT
from utilities.tokenCount import tokenCount
from utilities.folder_tree_structure import generate_folder_structure

fs = pd.DataFrame()


def max_cosine_sim(embeddings, prompt_embedding):
    y = 0
    for i in prompt_embedding:
        for x in embeddings:
            y = max(y, cosine_similarity(x, i))
    return y

def filter_functions(result_string, filepaths, email, userlogger, history):
    if history:
        #old task = "\nTask for you : If the user is speaking about a specific file path or particular functionality in the Current user prompt, filter the file paths that will be required to answer the current user prompt based on above given file summaries and the conversation between human and AI.\n If in the 'Current user prompt', the user strictly needs general information about the project like architechture, folder structure, tech stack or overall functionality, mention the code word 'FULL_PROJECT_INFO'. \n-----\nYour Response : \n"
        system_message = "You will be provided with [1] A list of file paths and their summaries delimited by triple quotes and [2] a chat between AI and Human User delimited XML tags. "
        system_message += "Your job is to guess the most relevant file paths that the user is speaking about in the Current User Prompt. If the user is not speaking about any specific files, but is speaking in general about the project like architecture, folder structure, functionality or usage mention the code word 'FULL_PROJECT_INFO' \n"
    else:
        #old task = "\nTask for you : If the user is speaking about a specific file path or particular functionality in the 'User prompt', just return the file paths that will be required to answer the current user prompt based on above given file summaries.\n If in the 'Current user prompt', the user strictly needs general information about the project like architechture, folder structure, tech stack or overall functionality, mention the code word 'FULL_PROJECT_INFO' \n-----\nYour Response : \n"
        system_message = "You will be provided with [1] A list of file paths and their summaries delimited by triple quotes and [2] a user prompt delimited XML tags. "
        system_message += "Your job is to guess the most relevant file paths that the user is speaking about in the Current User Prompt. If the user is not speaking about specific files, but is speaking in general about the project like architecture, folder structure, functionality or usage mention the code word 'FULL_PROJECT_INFO' \n"

    filter_prompt = result_string

    response_functions = AskGPT(email, system_message=system_message, prompt=filter_prompt, temperature=0)
    userlogger.log(response_functions)

    files = []
    if 'FULL_PROJECT_INFO' in response_functions:
        files = ["Referring Project Context"]

    for i in filepaths:
        # find i in response_functions using regex
        if re.search(i, response_functions):
            files.append(i)

    return files


def search_functions(code_query, email, userlogger, scope, history):
    global fs
    prompt_embedding = split_embed(code_query, email)

    fs['similarities'] = fs.embedding.apply(lambda x: max_cosine_sim(x, prompt_embedding) if x is not None else 1)
    if len(scope):
        files_in_scope = []
        for file in scope:
            if fs['file_path'].str.contains(file).any():
                files_in_scope.append(fs[fs['file_path'].str.contains(file)]['file_path'].tolist()[0])
        if len(files_in_scope) < 5:
            return files_in_scope
        if len(files_in_scope) >= 5:
            fs = fs[fs['file_path'].isin(files_in_scope)]

    res = fs.sort_values('similarities', ascending=False).head(10)

    res.index = range(1, len(res) + 1)
    file_summary_string = []
    for index, row in res.iterrows():
        file_path = row['file_path']
        summary = row['summary']
        if summary != "Ignore" and summary:
            file_summary = f'''"""File path: {file_path} Summary: {summary}"""'''
            file_summary_string.append(file_summary.replace('\n',' '))
        else:
            file_summary_string.append(f'''File path: {file_path}''')
        # Convert the concatenated list to a single string
    result_string = '\n\n'.join(file_summary_string)
    if not history:
        result_string += f"\n\n<User Prompt>\n{code_query}\n</User Prompt>\n"
    else:
        result_string+= f"\n{code_query}\n"
    filepaths = fs['file_path'].tolist()
    return filter_functions(result_string, filepaths, email, userlogger, history)


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

        history_prompt = "<Chat>\n"

        # Add previous user prompts, AI responses, and file references to the consolidated prompt
        for i, user_prompt in enumerate(previous_user_prompts):
            ai_response = previous_search_results[i]
            file_references = previous_files[i]  # Assuming each search returns 10 files

            consolidated_prompt = f"User prompt {i + 1}: {user_prompt}\n" \
                                  f"AI Response {i + 1}: {ai_response}\n" \
                                  f"File References {i + 1} : {file_references}\n\n"
            history_prompt += consolidated_prompt
            history_prompt += "\n"

        # Add the current prompt to the consolidated prompt
        history_prompt += f"Current user prompt : {current_prompt}\n</Chat>\n"

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
    history = False
    consolidated_prompt = consolidate_prompt_creation(chat_messages, prompt)
    if consolidated_prompt:
        prompt = consolidated_prompt
        history = True
    path = read_info(email)
    if path == "":
        return {'files': "", 'response': "You have not selected any repos, please open settings ⚙️ and set repo"}
    filename = "../user/" + email + "/AIFiles/" + path.split('/')[-1] + ".csv"
    fs = pd.read_csv(filename)
    fs['embedding'] = fs.embedding.apply(lambda x: str2float(str(x)))
    user_logger.log("Analyzing your query...")
    files = search_functions(prompt, email, user_logger, scope, history)
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
    final_prompt = ""
    estimated_tokens = 0
    if "Referring Project Context" in files:
        final_prompt = open("../user/"+email+"/AIFiles/"+path.split('/')[-1]+"_full_project_info.txt").read()
        final_prompt += "File Structure:\n" + generate_folder_structure(email,path.split('/')[-1])
        files.remove("Referring Project Context")

    if len(files)>=7:
        user_logger.log("I think, I need more information... ¯\_(ツ)_/¯...")
        files = []

    if estimated_tokens > 15000:
        for file in files:
            final_prompt += "\nFile path " + file + ":\n"
            final_prompt += fs['summary'][fs['file_path'] == file].values[0]
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
    referenced_code = get_referenced_code(path, files)
    user_logger.clear_logs()
    return {'files': files, 'response': FinalAnswer, 'referenced_code': referenced_code}


if __name__ == "__main__":
    '''
    question = "What should I do next in this project?" #passed
    Answer = Ask_AI_search_files(question, user_logger=UserLogger("prathamthepro@gmail.com"), email="prathamthepro@gmail.com",chat_messages=None, scope=[])
    print(question)
    print(Answer)

    question = "How is the repository being cloned?"  #passed
    #question = "Add a new modal in the front end code, that will pop up when an erorr occurs while making an API call" #passed
    Answer = Ask_AI_search_files(question, user_logger=UserLogger("prathamthepro@gmail.com"), email="prathamthepro@gmail.com",chat_messages=None, scope=[])
    print(question)
    print(Answer)


    question = "When the user submits an answer from the welcome component how is it passed to the backend?" #Passed
    Answer = Ask_AI_search_files(question, user_logger=UserLogger("prathamthepro@gmail.com"), email="prathamthepro@gmail.com",chat_messages=None, scope=[])
    print(question)
    print(Answer)
    

    question = "Hi" #TMI
    Answer = Ask_AI_search_files(question, user_logger=UserLogger("prathamthepro@gmail.com"), email="prathamthepro@gmail.com",chat_messages=None, scope=[])
    print(question)
    print(Answer)


    question = "Add a new modal in the front end code, that will pop up when an erorr occurs while making an API call" #passed
    Answer = Ask_AI_search_files(question, user_logger=UserLogger("prathamthepro@gmail.com"), email="prathamthepro@gmail.com",chat_messages=None, scope=[])
    print(Answer)
    


    question = "Add parallelization to the training repo process, we should also be able to log into the userlogger how much of the repo is trained as a percentage" #passed
    Answer = Ask_AI_search_files(question, user_logger=UserLogger("prathamthepro@gmail.com"), email="prathamthepro@gmail.com",chat_messages=None, scope=[])
    print(question)
    print(Answer)

    '''
    question = "How do I add dark mode functionality to the project" #Passed
    Answer = Ask_AI_search_files(question, user_logger=UserLogger("prathamthepro@gmail.com"), email="prathamthepro@gmail.com",chat_messages=None, scope=[])
    print(question)
    print(Answer)


