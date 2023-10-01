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
from utilities.mixpanel import track_event
from langchain.text_splitter import RecursiveCharacterTextSplitter, Language
from sklearn.feature_extraction.text import TfidfVectorizer
import re, nltk
from nltk.stem import PorterStemmer
from nltk.corpus import stopwords
if not nltk.corpus.stopwords.words('english'):
    print("Stopwords not found. Downloading...")
    nltk.download('stopwords')
else:
    print("Stopwords are already downloaded.")

# Now, you can use stopwords
stop_words = set(stopwords.words('english'))

fs = pd.DataFrame()

def process_file_contents_with_langchain(contents, user_prompt, maximum_tokens=2000, filename=""):
    chunks = re.split(r'\n', contents)
    stemmer = PorterStemmer()

    # Apply stemming to chunks before vectorization
    stemmed_chunks = []
    for chunk in chunks:
        # Tokenize the chunk and apply stemming to each token
        tokens = chunk.split()
        stemmed_tokens = [stemmer.stem(token) for token in tokens if token.lower() not in stop_words]
        stemmed_chunk = ' '.join(stemmed_tokens)
        stemmed_chunks.append(stemmed_chunk)

    # Create TF-IDF matrix with the stemmed chunks
    tfidf_vectorizer = TfidfVectorizer()
    tfidf_matrix = tfidf_vectorizer.fit_transform(stemmed_chunks)

    # Transform the user prompt using the fitted vectorizer
    tokens = user_prompt.split()
    stemmed_tokens = [stemmer.stem(token) for token in tokens if token.lower() not in stop_words]
    stemmed_prompt = ' '.join(stemmed_tokens)
    user_prompt_tfidf = tfidf_vectorizer.transform([stemmed_prompt])

    similarities = (tfidf_matrix * user_prompt_tfidf.T).toarray().flatten()
    chunk_indices = similarities.argsort()[::-1]  # Get indices of chunks sorted by similarity

    # Mapping of file extensions to programming languages
    extension_to_lang = {
        'cpp': 'cpp',
        'h': 'cpp',
        'hpp': 'cpp',
        'hxx': 'cpp',
        'cxx': 'cpp',
        'go': 'go',
        'java': 'java',
        'js': 'js',
        'php': 'php',
        'proto': 'proto',
        'py': 'python',
        'rst': 'rst',
        'rb': 'ruby',
        'rs': 'rust',
        'scala': 'scala',
        'swift': 'swift',
        'md': 'markdown',
        'tex': 'latex',
        'html': 'html',
        'htm': 'html',
        'sol': 'sol',
    }

    # Get language based on file extension or default to 'javascript'
    lang = extension_to_lang.get(filename.split('.')[-1], 'javascript')

    for e in Language:
        if e.value == lang:
            language = e.value
            break

    chunk_size = 3000  # Adjust the chunk size as needed
    chunk_overlap = 0  # No overlap between chunks
    langchain_splitter = RecursiveCharacterTextSplitter.from_language(
        language=language, chunk_size=chunk_size, chunk_overlap=chunk_overlap
    )

    # Split the contents into LangChain documents
    langchain_docs = langchain_splitter.create_documents([contents])

    # Extract chunks from LangChain documents
    big_chunks = [doc.page_content for doc in langchain_docs]
    selected_big_chunk_indices = set()
    total_tokens = 0

    for idx in chunk_indices:
        chunk = chunks[idx]
        if idx>=2 and idx+2<len(chunks):
            chunk_minus = chunks[idx-2]+"\n"+chunks[idx-1]+"\n"+chunks[idx]
            chunk_plus = chunk+"\n"+chunks[idx+1]+"\n"+chunks[idx+2]
        else:
            chunk_plus = chunk
            chunk_minus =chunk

        for big_chunk_index, big_chunk in enumerate(big_chunks):
            if chunk_plus in big_chunk or chunk_minus in big_chunk:
                if total_tokens + tokenCount(big_chunk) <= maximum_tokens:
                    selected_big_chunk_indices.add(big_chunk_index)
                    joined_big_chunks = "\n".join([big_chunks[i] for i in selected_big_chunk_indices])
                    total_tokens = tokenCount(re.sub(r'\s+', ' ', joined_big_chunks))

    joined_big_chunks = "\n".join([big_chunks[i] for i in selected_big_chunk_indices])
    return re.sub(r'\s+', ' ', joined_big_chunks)

def max_cosine_sim(embeddings, prompt_embedding):
    y = 0
    for i in prompt_embedding:
        for x in embeddings:
            y = max(y, cosine_similarity(x, i))
    return y

def filter_functions(result_string, filepaths, email, userlogger, history):
    if history:
        #old task = "\nTask for you : If the user is speaking about a specific file path or particular functionality in the Current user prompt, filter the file paths that will be required to answer the current user prompt based on above given file summaries and the conversation between human and AI.\n If in the 'Current user prompt', the user strictly needs general information about the project like architechture, folder structure, tech stack or overall functionality, mention the code word 'FULL_PROJECT_INFO'. \n-----\nYour Response : \n"
        system_message = "You will be provided with [1] A list of file paths and their roles and summaries delimited by triple quotes and [2] a chat between AI and Human User delimited XML tags. "
        system_message += "Your job is to guess the relevant files that the user is speaking about in the Current User Prompt and return a filtered list of file paths. If the user is not speaking about any specific files, but is speaking in general about the project like architecture, folder structure, functionality or usage mention the code word 'FULL_PROJECT_INFO'"
    else:
        #old task = "\nTask for you : If the user is speaking about a specific file path or particular functionality in the 'User prompt', just return the file paths that will be required to answer the current user prompt based on above given file summaries.\n If in the 'Current user prompt', the user strictly needs general information about the project like architechture, folder structure, tech stack or overall functionality, mention the code word 'FULL_PROJECT_INFO' \n-----\nYour Response : \n"
        system_message = "You will be provided with [1] A list of file paths and their roles and summaries delimited by triple quotes and [2] a user prompt delimited by XML tags. "
        system_message += "Your job is to guess the relevant files that the user is speaking about in the User Prompt and return a filtered list of file paths . If the user is not speaking about specific files, but is speaking in general about the project like architecture, folder structure, functionality or usage mention the code word 'FULL_PROJECT_INFO'"

    filter_prompt = result_string

    response_functions = AskGPT(email, system_message=system_message, prompt=filter_prompt, temperature=0, max_tokens=700)
    #userlogger.log(response_functions)
    files = []
    if 'FULL_PROJECT_INFO' in response_functions:
        files = ["Referring Project Context"]

    for i in filepaths:
        # find i in response_functions using regex
        if re.search(str(i), response_functions):
            files.append(i)

    return files


def search_functions(code_query, email, userlogger, scope, history, history_files):
    global fs
    if len(scope):
        files_in_scope = []
        for file in scope:
            if fs['file_path'].str.contains(file).any():
                for j in fs[fs['file_path'].str.contains(file)]['file_path'].tolist():
                    files_in_scope.append(j)
        if len(files_in_scope) < 5:
            return files_in_scope
        if len(files_in_scope) >= 5:
            fs = fs[fs['file_path'].isin(files_in_scope)]

    prompt_embedding = split_embed(code_query , email)
    fs['similarities'] = fs.embedding.apply(lambda x: max_cosine_sim(x, prompt_embedding) if x is not None else 1)
    res = fs.sort_values('similarities', ascending=False).head(10)
    filepaths = set(res['file_path'])
    for x in history_files:
        filepaths.add(x)

    file_summary_string = []
    
    for index, row  in fs.iterrows():
        file_path = row['file_path']
        if file_path in filepaths:
            # Get the summary from the file path    
            summary = row['summary']
            role = row['role']
            if summary != "Ignore" and summary:
                if role :
                    file_summary = f'''"""File path: {file_path} \nRole: {role} \nSummary: {summary}"""'''
                else:
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


def get_referenced_code(path, files, email):
    referenced_code = []

    for file in files:
        try:
            if file.endswith(".ipynb"):
                code = convert_ipynb_to_python(os.path.join(path, file))
            else:
                with open(os.path.join("../user/"+email+"/"+path, file), 'r') as f:
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

        history_prompt = "\n<Chat>\n"

        # Add previous user prompts, AI responses, and file references to the consolidated prompt
        for i, user_prompt in enumerate(previous_user_prompts):
            ai_response = previous_search_results[i]
            consolidated_prompt = f"User prompt {i + 1}: {user_prompt}\n" \
                                  f"AI Response {i + 1}: {ai_response}\n"
            history_prompt += consolidated_prompt
            history_prompt += "\n"

        # Add the current prompt to the consolidated prompt
        history_prompt += f"Current user prompt : {current_prompt}\n</Chat>\n\n"

        return history_prompt.strip()

    return ""


def Ask_AI_search_files(prompt, user_logger, email, chat_messages, scope, project_name):
    global fs
    user_logger.log("Analyzing your query...")
    history = False
    path = "../user/" + email + "/AIFiles/" + project_name    
    track_event('AskAI', {'email': email, 'chat': chat_messages, 'Repo': path.split('/')[-1],  'prompt':prompt})
    consolidated_prompt = consolidate_prompt_creation(chat_messages, prompt)
    history_files = []
    if chat_messages is not None:
        for message in chat_messages:
            history_files = message['response']['files']
    if consolidated_prompt:
        prompt = consolidated_prompt
        history = True
    if path == "":
        return {'files': "", 'response': "You have not selected any repos, please open settings ⚙️ and set repo"}
    filename = "../user/" + email + "/AIFiles/" + path.split('/')[-1] + ".csv"
    fs = pd.read_csv(filename)
    fs['embedding'] = fs.embedding.apply(lambda x: str2float(str(x)))
    files = search_functions(prompt, email, user_logger, scope, history, history_files)
    return {'files': files}


def Ask_AI_with_referenced_files(og_prompt, user_logger, email, chat_messages, files, path):
    consolidated_prompt = consolidate_prompt_creation(chat_messages, og_prompt)
    if consolidated_prompt:
        prompt = consolidated_prompt
        system_message = "You will be provided with [1] file paths and contents of the files in the repository delimited by triple quotes and [2] a conversation between a human and an AI delimited by xml tags. Answer the 'Current user prompt' using given context."
    else:
        prompt = "User Prompt: "+og_prompt
        system_message = "You will be provided with [1] file paths and contents of the files in the repository delimited by triple quotes and [2] User Prompt. You are a helpful coding assistant, that helps the user."

    
    if path == "":
        return {'files': "", 'response': "You have not selected any repos, please open settings ⚙️ and set repo"}
    filename = "../user/" + email + "/AIFiles/" + path + ".csv"
    fs = pd.read_csv(filename)
    fs['embedding'] = fs.embedding.apply(lambda x: str2float(str(x)))

    final_prompt = ""
    if "Referring Project Context" in files:
        final_prompt = open("../user/"+email+"/AIFiles/"+path+"_full_project_info.txt").read()
        final_prompt += "File Structure:\n" + generate_folder_structure(email,path)
        files.remove("Referring Project Context")
        if len(files) ==0:
            if consolidated_prompt:
                prompt = consolidated_prompt
                system_message = "You will be provided with [1] a conversation between a human and an AI delimited by xml tags and [2] summary and architechture of a repository."
            else:
                prompt = "User Prompt: "+prompt
                system_message = "You will be provided with [1] User Prompt and [2] summary and architechture of a repository. "
        else:
            if consolidated_prompt:
                prompt = consolidated_prompt
                system_message = "You will be provided with \n1. a conversation between a human and an AI delimited by xml tags \n2. summary and architechture of a repository \n3.A list of file paths and their summaries delimited by triple quotes. Your task is to help the user with the 'Current user prompt'."
            else:
                prompt = "User Prompt: "+prompt
                system_message = "You will be provided with \n1. a User Prompt \n2. summary and architechture of a repository \n3.A list of file paths and their summaries delimited by triple quotes. "
    '''else:
        user_logger.log("Referring Files : " + str(files))

    if len(files)>=7:
        user_logger.log("I think, I need more information... ¯\_(ツ)_/¯...")
        files = []
        final_prompt = open("../user/"+email+"/AIFiles/"+path.split('/')[-1]+"_full_project_info.txt").read()
        final_prompt += "File Structure:\n" + generate_folder_structure(email,path.split('/')[-1])
        if consolidated_prompt:
            prompt = consolidated_prompt
            system_message = "As a coding assistant, you will be provided with \n1. a conversation between a human and an AI delimited by xml tags \n2. Summary and architechture of a repository.\nYour task is to ask the user for more context about 'Current user prompt' and which files will be relevant to answer it."
        else:
            prompt = "User Prompt: "+prompt
            system_message = "As a coding assistant, you will be provided with \n1. a User Prompt \n2. summary and architechture of a repository\nYour task is to ask the user for more context about 'Current user prompt' and which files will be relevant to answer it."
    '''

    estimated_tokens = 0


    for i in files:
        final_prompt += "```File path " + str(i) + ":\n"
        j = os.path.join("../user/"+email+"/"+path, i)
        if j.endswith(".ipynb"):
            final_contents = convert_ipynb_to_python(j)
        else:
            final_contents = open(j).read()

        if tokenCount(re.sub(r'\s+', ' ', final_contents)) > 5000:
            bag_of_words = og_prompt
            for message in chat_messages:
                bag_of_words += message['prompt']['searchTerm']
                if message['response']['searchResults']:
                    bag_of_words += message['response']['searchResults']

            processed_contents = process_file_contents_with_langchain(final_contents, bag_of_words, 7000, j)
            final_prompt += re.sub(r'\s+', ' ', processed_contents) + "\n```" +'\n\n'
        else:
            final_contents = re.sub(r'\s+', ' ', final_contents)
            final_prompt += final_contents + "\n```" + '\n'


    if estimated_tokens > 15000:
        for file in files:
            final_prompt += "\nFile path " + file + ":\n"
            final_prompt += fs['summary'][fs['file_path'] == file].values[0]

    final_prompt += "\n\n" + prompt #+ "\n Response :"
    tokens = tokenCount(final_prompt)
    print("Total Tokens in the query: " + str(tokens))
    user_logger.clear_logs()
    user_logger.log("Thinking of an answer...")
    FinalAnswer = AskGPT(email=email, system_message=system_message, prompt=final_prompt, temperature=1, model='gpt-3.5-turbo')
    referenced_code = get_referenced_code(path, files, email)
    user_logger.clear_logs()
    return {'files': files, 'response': FinalAnswer, 'referenced_code': referenced_code}


if __name__ == "__main__":
    
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
    '''

    question = "Hi" #TMI
    Answer = Ask_AI_search_files(question, user_logger=UserLogger("prathamthepro@gmail.com"), email="prathamthepro@gmail.com",chat_messages=None, scope=[])
    print(question)
    print(Answer)


    question = "Add a new modal in the front end code, that will pop up when an erorr occurs while making an API call" #passed
    Answer = Ask_AI_search_files(question, user_logger=UserLogger("prathamthepro@gmail.com"), email="prathamthepro@gmail.com",chat_messages=None, scope=[])

    print(question)
    print(Answer)
    


    question = "Add parallelization to the training repo process, we should also be able to log into the userlogger how much of the repo is trained as a percentage" #passed
    Answer = Ask_AI_search_files(question, user_logger=UserLogger("prathamthepro@gmail.com"), email="prathamthepro@gmail.com",chat_messages=None, scope=[])
    print(question)
    print(Answer)

    question = "How do I add dark mode functionality to the project" #Passed
    Answer = Ask_AI_search_files(question, user_logger=UserLogger("prathamthepro@gmail.com"), email="prathamthepro@gmail.com",chat_messages=None, scope=[])
    print(question)
    print(Answer)

    question = "Create a new python file that will help me analyse the file summaries of the repos that have been trained "
    Answer = Ask_AI_search_files(question, user_logger=UserLogger("prathamthepro@gmail.com"), email="prathamthepro@gmail.com",chat_messages=None, scope=[])
    print(question)
    print(Answer)

    question="Give code for the handle file check function in the leftwelcome component that will be sent as props to the Filetree.js component, (Directory Tree View). Refer FileTree component and LeftWelcome"
    Answer = Ask_AI_search_files(question, user_logger=UserLogger("prathamthepro@gmail.com"), email="prathamthepro@gmail.com",chat_messages=None, scope=[])
    print(question)
    print(Answer)
    '''
