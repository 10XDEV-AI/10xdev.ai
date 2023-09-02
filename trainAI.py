import pandas as pd, os, time, re
from utilities.embedding import split_embed
from utilities.create_clone import create_clone
from utilities.files2analyse import files2analyse, check_file_type
from utilities.tokenCount import tokenCount
from utilities.rates import get_rates
from  utilities.repoutils import select_repo
from utilities.notebook_utils import convert_ipynb_to_python
from utilities.create_project_summary import create_project_summary, get_project_summary
from utilities.summarize import summarize_str
from utilities.mixpanel import track_event
from utilities.AskGPT import AskGPT
from nltk.corpus import stopwords


def summarize_file(repo_name, filepath, i, userlogger, email):
    full_file_path = os.path.join("../user", email, repo_name, filepath)

    if not check_file_type(full_file_path):
        print("File " + filepath + " was not summarized as it is not a text file")
        p = ("File " + filepath + " was not Analyzed as it is not a text file")
        userlogger.log(p)
        return i, "Ignore"

    i += 1

    if filepath.endswith(".ipynb"):
        # Convert .ipynb file to human-readable format
        file_contents = convert_ipynb_to_python(full_file_path)
    else:
        with open(full_file_path, 'r') as f:
            try:
                file_contents = f.read()
            except UnicodeDecodeError:
                p = ("File " + filepath + " was not Analyzed as it is not a text file")
                userlogger.log(p)
                return i, "Ignore"

    if tokenCount(file_contents) > 60000:
        p = ("File " + filepath + " was not analyzed as it is too long")
        userlogger.log(p)
        return i, "File content too long"

    return i, summarize_str(filepath, file_contents, email, userlogger)

def train_AI(repo_name, userlogger, email):
    track_event('TrainAI', {'email': email, 'Repo': repo_name})

    fsfilename = "../user/" + email + '/AIFiles/' + repo_name + ".csv"

    file_paths_details = files2analyse(repo_name, email)

    if len(file_paths_details) == 0:
        #create an empty dataframe with filepath, embedding and summary columns
        fs = pd.DataFrame(columns=['file_path', 'embedding', 'summary'])
        fs.to_csv(fsfilename, index=False)
        userlogger.log("This repo is empty, nothing to train")
        return

    fs = pd.DataFrame(file_paths_details)
    fs.columns = ['file_path']
    start_time = time.time()

    i = 0
    fs['summary'] = ''
    fs['embedding'] = ''
    fs['role'] = ''
    userlogger.log("Starting analysis", percent="0", time_left="0")

    for ind in fs.index:
        i_new, fs['summary'][ind] = summarize_file(repo_name, fs['file_path'][ind], i, userlogger, email)
        if i_new != i:
            i = i_new
        if i != 0:
            time_elapsed = time.time() - start_time
            p = str(round(100 * (ind + 1) / len(fs)))
            t = str(round(time_elapsed / 60, 2))
            log_str = "Analyzing "+ fs['file_path'][ind]
            userlogger.clear_logs()
            userlogger.log(log_str,percent=p,time_left=t)

    fs = fs[fs['summary'] != "Ignore"]

    fs.to_csv(fsfilename, index=False)
    create_project_summary(repo_name,email)
    prompt_string = get_project_summary(repo_name, email)
    total_token_count = tokenCount(prompt_string)
    batch_size_limit = 10000
    system_message = """
                You will be given a summary of a codebase, it's folder structure, few file paths and the summarised contents of the files. 
                Your task is to evaluate what the role of each of the files is in the codebase.
                
                Then you will output the role of each file.
                Each file's role must strictly follow a markdown code block format:
                
                File Path : FILEPATH
                ```
                Role : ROLE
                ```
                Before you finish, double check that the role of all the file paths mentioned by the user has been clarified. Be concise. Answer in a short sentence.
                """
        
    batch_prompt = prompt_string
    batch_token_count = total_token_count 
    
    processed_indices = []
    parsable = ''
    for ind in fs.index:
        if ind in processed_indices:
            continue
        
        file_path = fs['file_path'][ind]
        summary = fs['summary'][ind]
        file_summary_token_count = tokenCount(file_path) + tokenCount(summary)
        
        if batch_token_count + file_summary_token_count < batch_size_limit:
            batch_prompt += f"\n\nFile path: {file_path}\n{summary}"
            batch_token_count += file_summary_token_count
            processed_indices.append(ind)
        else:
            parsable += AskGPT(email=email, system_message=system_message, prompt=batch_prompt, temperature=0)
            print(parsable)
            batch_prompt = prompt_string
            batch_token_count = total_token_count
    parsable += AskGPT(email=email, system_message=system_message, prompt=batch_prompt, temperature=0)


    regex = r"(\S+)\n\s*```[^\n]*\n(.+?)```"

    matches = re.finditer(regex, parsable, re.DOTALL)

    for match in matches:
        # Strip the filename of any non-allowed characters and convert / to \
        path = re.sub(r'[\:<>"|?*]', "", match.group(1))

        # Remove leading and trailing brackets
        path = re.sub(r"^\[(.*)\]$", r"\1", path)

        # Remove leading and trailing backticks
        path = re.sub(r"^`(.*)`$", r"\1", path)

        # Remove trailing ]
        path = re.sub(r"[\]\:]$", "", path)

        # Get the code
        role = match.group(2)

        if "File Path :" in path or "File Path:" in path:
            path = path.replace("File Path :", "").replace("File Path:", "")

        if "Role :" in role or "Role:" in role:
            role = role.replace("Role :", "").replace("Role:", "")

        fs.loc[fs['file_path'] == path, 'role'] = role

    userlogger.clear_logs()
    userlogger.log("Indexing files")
    start_time = time.time()
    embedding_rate = 600
    stop_words = set(stopwords.words('english'))
    
    delay = 60/embedding_rate
    for ind in fs.index:
        if fs['summary'][ind] != "Ignore":
            filtered_summary = ' '.join([word for word in (fs['file_path'][ind] + fs['role'][ind] + fs['summary'][ind]).split() if word.lower() not in stop_words])
            fs['embedding'][ind] = split_embed(filtered_summary, email)
            time_elapsed = time.time() - start_time
            p = str(round(100 * (ind + 1) / len(fs)))
            t = str(round(time_elapsed / 60, 2))
            time.sleep(delay)
            userlogger.clear_logs()
            userlogger.log("Indexing :"+fs['file_path'][ind],percent=p,time_left=t)

    userlogger.clear_logs()
    userlogger.log("Indexed all files successfully")

    fs.to_csv(fsfilename, index=False)

    select_repo(repo_name,email)
    print("100% Done")
    create_clone(repo_name, email)
    userlogger.clear_logs()
    userlogger.log("Your repo was trained into the AI successfully")
    time.sleep(2)
    userlogger.clear_logs()
    return
