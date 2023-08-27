from utilities.AskGPT import AskGPT
from utilities.create_project_summary import get_project_summary
from utilities.tokenCount import tokenCount
import pandas as pd
import re
 
def test_summarize_big():
    fsfilename = "../user/" + "prathamthepro@gmailcom" + '/AIFiles/' + "10xdev.ai" + ".csv"

    fs = pd.read_csv(fsfilename)

    prompt_string = get_project_summary('10xdev.ai', "prathamthepro@gmail.com")
    total_token_count = tokenCount(prompt_string)
    batch_size_limit = 15000   
    system_message = """
            You will be given a summary of a codebase, it's folder structure, few file paths and the summarised contents of the files. 
            Your task is to evaluate what the role of each of the files is in the codebase.
            
            Then you will output the role of each file.
            Each file's role must strictly follow a markdown code block format:
            
            File Path : FILEPATH
            ```
            Role : ROLE
            ```
            Before you finish, double check that the role of all the file paths mentioned by the user has been clarified
            """
        
    batch_prompt = prompt_string
    batch_token_count = total_token_count 
    
    processed_indices = []

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
            parsable = AskGPT(system_message=system_message, prompt=batch_prompt, temperature=0)
            print(parsable)

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
            
                batch_prompt = prompt_string
                batch_token_count = total_token_count
    parsable = AskGPT(email=email, system_message=system_message, prompt=batch_prompt, temperature=0)


    regex = r"(\S+)\n\s*```[^\n]*\n(.+?)```"

    matches = re.finditer(regex, parsable, re.DOTALL)

    files = []
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

    
    userlogger.log("Indexing files")
    userlogger.clear_logs()
    start_time = time.time()
    embedding_rate = 600
    stop_words = set(stopwords.words('english'))
    
    delay = 60/embedding_rate
    for ind in fs.index:
        if fs['summary'][ind] != "Ignore":
            filtered_summary = ' '.join([word for word in (fs['filepath'][ind] + fs['role'][ind] + fs['summary'][ind]).split() if word.lower() not in stop_words])
            fs['embedding'][ind] = split_embed(filtered_summary, email)
            time_elapsed = time.time() - start_time
            p = str(round(100 * (ind + 1) / len(fs)))
            t = str(round(time_elapsed / 60, 2))
            time.sleep(delay)
            userlogger.clear_logs()
            userlogger.log("",percent=p,time_left=t)


    userlogger.log("Indexed all files successfully")

    fs.to_csv(fsfilename, index=False)

    select_repo(repo_name,email)
# Run the test
if __name__ == "__main__":
    test_summarize_big()