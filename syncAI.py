import time, subprocess, os, pandas as pd
from utilities.projectInfo import read_info
from utilities.embedding import split_embed
from utilities.create_clone import create_clone, get_clone_filepath
from utilities.str2float import str2float
from utilities.AskGPT import AskGPT
from utilities.files2analyse import check_file_type, files2analyse
from utilities.notebook_utils import convert_ipynb_to_python
from utilities.create_project_summary import create_project_summary, get_project_summary
from utilities.mixpanel import track_event
import difflib, re
from utilities.tokenCount import tokenCount
from nltk.corpus import stopwords


fs = pd.DataFrame()

def get_diff(old_file_path, new_file_path, threshold=0.1):
    old_size = os.path.getsize(old_file_path)
    if not os.path.exists(new_file_path):
        return None
    new_size = os.path.getsize(new_file_path)
    with open(old_file_path, 'r') as old_file, open(new_file_path, 'r') as new_file:
        old_lines = old_file.readlines()
        new_lines = new_file.readlines()
    differ = difflib.ndiff(old_lines, new_lines)
    diff_output = differ
    if old_lines == new_lines:
        return None
    num_changes = 0
    for line in differ:
        if line.startswith("+"):
            num_changes += 1
        elif line.startswith("-"):
            num_changes += 1
        elif line.startswith("?"):
            num_changes += 1
    total_lines = max(old_size, new_size)
    change_ratio = num_changes / total_lines
    if change_ratio > threshold:
        return diff_output
    else:
        return None

def summarize_str(filename, file_contents, userid):
    prompt = "File " + filename + " has " + file_contents
    system_message = "Summarize what this file in the codebase does, assume context when necessary."
    return AskGPT(userid, system_message=system_message, prompt=prompt, temperature=0)


def summarize(filename, userid):
    root = read_info(userid)
    full_filepath = os.path.join(root, filename)

    if not check_file_type(full_filepath):
        print("File " + filename + " was not summarized as it is not a text file")
        return "Ignore"

    if filename.endswith(".ipynb"):
        # Convert .ipynb file to human-readable format
        file_contents = convert_ipynb_to_python(full_filepath)
    else:
        with open(full_filepath, 'r') as f:
            try:
                file_contents = f.read()
            except UnicodeDecodeError:
                print("File " + filename + " was not summarized as it is not a text file")
                return "Ignore"

    return summarize_str(filename, file_contents, userid)

def syncAI(sync_flag, user_logger, userid):
    path = read_info(userid)
    track_event('syncAI', {'email': userid, 'Repo': path})

    filename = "../user/" + userid + "/AIFiles/" + path.split('/')[-1] + "_full_project_info.txt"
    if not os.path.exists(filename):
        create_project_summary(path.split('/')[-1], email=userid)

    # git pull at path
    subprocess.run(["git", "fetch", "--prune"], cwd=path)
    subprocess.run(["git", "pull"], cwd=path)

    global fs
    fsfilename = "../user/" + userid + "/AIFiles/" + path.split("/")[-1] + ".csv"

    fs = pd.read_csv(fsfilename)
    if "role" not in fs.columns:
        fs["role"] = ''
    file_paths_details = files2analyse(path.split("/")[-1], userid)

    for file in file_paths_details:
        clone_path = get_clone_filepath(userid, path.split("/")[-1], file)
        if get_diff(os.path.join(path, file), clone_path) is not None:
            print("File " + file + " has changed")
            user_logger.log("File " + file + " has changed. Syncing AI...")
            summary = summarize(file, userid)
            if summary == "Ignore":
                continue
            fs["summary"][fs["file_path"] == file] = summary
            fs["embedding"] = ''
            fs["role"] = ''

    del_file_paths = set(fs["file_path"]) - set(file_paths_details)

    # Iterate over the del_file_paths set and remove the corresponding rows from dataframes
    for file_path in del_file_paths:
        fs = fs[fs["file_path"] != file_path]
        print("Deleted File: " + str(file_path))


    new_file_paths = set(file_paths_details) - set(fs["file_path"])


    if len(new_file_paths) > 0:
        if sync_flag == 0:
            return "NEW", list(new_file_paths)

        # Iterate over the new_file_paths set and create a new row for each file path
        new_rows = []
        for file_path in new_file_paths:
            # Create a dictionary with the values for each column in the new row
            row_dict = {"file_path": file_path}
            # Append the new row to the new_rows list
            new_rows.append(row_dict)
            print("New File: " + file_path)

        # Convert the new_rows list of dictionaries to a pandas DataFrame
        new_fs = pd.DataFrame(new_rows)

        #set the embedding as 'pandas.core.series.Series' but empty
        new_fs["embedding"] = ''
        new_fs["summary"] = ''
        new_fs["role"] = ''

        for ind in new_fs.index:
            user_logger.log("Analyzing New File: " + new_fs["file_path"][ind])
            new_fs["summary"][ind] = summarize(new_fs["file_path"][ind], userid)

        fs = pd.concat([fs, new_fs], ignore_index=True)

        # Add new summaries to the summary file with the keyword "Recently_added_file_path"
        with open("../user/" + userid + "/AIFiles/" + path.split("/")[-1] + "_full_project_info.txt", "a") as summary_file:
            for ind in new_fs.index:
                if new_fs["summary"][ind] != "Ignore":
                    summary_file.write("\nRecently_added_file_path : " + new_fs["file_path"][ind] + ":" + new_fs["summary"][ind])

    keyword = "Recently_added_file_path"
    filename = "../user/" + userid + "/AIFiles/" + path.split('/')[-1] + "_full_project_info.txt"
    keyword_count = 0

    with open(filename, 'r') as file:
        for line in file:
            keyword_count += line.count(keyword)
    total_files_count = len(fs)
    keyword_percentage = keyword_count / total_files_count

    if keyword_percentage > 0.05:
        # Call the function create_project_summary if the condition is met
        create_project_summary(path.split("/")[-1], userid)


    user_logger.clear_logs()
    
    filtered_fs = fs[pd.isnull(fs["role"])]

    if len(filtered_fs) > 0:
            
        prompt_string = get_project_summary(path.split("/")[-1], userid)
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
        for ind in filtered_fs.index:
            if ind in processed_indices:
                continue

            file_path = filtered_fs['file_path'][ind]
            summary = filtered_fs['summary'][ind]
            file_summary_token_count = tokenCount(file_path) + tokenCount(summary)

            if batch_token_count + file_summary_token_count < batch_size_limit:
                batch_prompt += f"\n\nFile path: {file_path}\n{summary}"
                batch_token_count += file_summary_token_count
                processed_indices.append(ind)
            else:
                parsable += AskGPT(email=userid, system_message=system_message, prompt=batch_prompt, temperature=0)
                batch_prompt = prompt_string
                batch_token_count = total_token_count

        parsable += AskGPT(email=userid, system_message=system_message, prompt=batch_prompt, temperature=0)
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
            fs.loc[fs['file_path'] == path, 'embedding'] = ''


        filtered_fs = fs[pd.isnull(fs["role"])]
        parsable = ''

        prompt_string = get_project_summary(read_info(email=userid).split("/")[-1], userid)
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
                Before you finish, double check that the role of all the file paths mentioned by the user has been clarified. Be concise.Answer in a short sentence.
                """
        if len(filtered_fs) != 0:

            batch_prompt = prompt_string
            batch_token_count = total_token_count
            processed_indices = []

            for ind in filtered_fs.index:
                if ind in processed_indices:
                    continue
                file_path = filtered_fs['file_path'][ind]
                summary = filtered_fs['summary'][ind]
                file_summary_token_count = tokenCount(file_path) + tokenCount(summary)

                if batch_token_count + file_summary_token_count < batch_size_limit:
                    batch_prompt += f"\n\nFile path: {file_path}\n{summary}"
                    batch_token_count += file_summary_token_count
                    processed_indices.append(ind)
                else:
                    parsable += AskGPT(email=userid, system_message=system_message, prompt=batch_prompt, temperature=0)
                    batch_prompt = prompt_string
                    batch_token_count = total_token_count
            parsable += AskGPT(email=userid, system_message=system_message, prompt=batch_prompt, temperature=0)

            if len(fs[fs["role"] == '']) != 0:
                filtered_fs = fs[pd.isnull(fs["role"])]
                path = read_info(userid)
                prompt_string = get_project_summary(path.split("/")[-1], userid)
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
                        Before you finish, double check that the role of all the file paths mentioned by the user has been clarified. Be concise.Answer in a short sentence.
                        """

                batch_prompt = prompt_string
                batch_token_count = total_token_count
                processed_indices = []
                parsable = ""
                for ind in filtered_fs.index:
                    if ind in processed_indices:
                        continue

                    file_path = filtered_fs['file_path'][ind]
                    summary = filtered_fs['summary'][ind]
                    file_summary_token_count = tokenCount(file_path) + tokenCount(summary)

                    if batch_token_count + file_summary_token_count < batch_size_limit:
                        batch_prompt += f"\n\nFile path: {file_path}\n{summary}"
                        batch_token_count += file_summary_token_count
                        processed_indices.append(ind)
                    else:
                        parsable += AskGPT(email=userid, system_message=system_message, prompt=batch_prompt, temperature=0)
                        batch_prompt = prompt_string
                        batch_token_count = total_token_count
                parsable += AskGPT(email=userid, system_message=system_message, prompt=batch_prompt, temperature=0)

                filtered_fs = fs[pd.isnull(fs["role"])]

                if len(filtered_fs) != 0:

                    prompt_string = get_project_summary(path.split("/")[-1], userid)
                    total_token_count = tokenCount(prompt_string)
                    batch_size_limit = 10000
                    system_message = """
                            You will be given a summary of a codebase, it's folder structure, few file paths and the summarised contents of the files. 
                            Your task is to output the role of each file in the codebase.
                            
                            Each file's role must strictly follow a markdown code block format:
                            
                            File Path : FILEPATH
                            ```
                            Role : ROLE
                            ```
                            Before you finish, double check that the role of all the file paths mentioned by the user has been clarified. Be concise.Answer in a short sentence.
                            """

                    batch_prompt = prompt_string
                    batch_token_count = total_token_count
                    processed_indices = []

                    for ind in filtered_fs.index:
                        if ind in processed_indices:
                            continue

                        file_path = filtered_fs['file_path'][ind]
                        summary = filtered_fs['summary'][ind]
                        file_summary_token_count = tokenCount(file_path) + tokenCount(summary)

                        if batch_token_count + file_summary_token_count < batch_size_limit:
                            batch_prompt += f"\n\nFile path: {file_path}\n{summary}"
                            batch_token_count += file_summary_token_count
                            processed_indices.append(ind)
                        else:
                            parsable += AskGPT(email=userid, system_message=system_message, prompt=batch_prompt, temperature=0)
                            batch_prompt = prompt_string
                            batch_token_count = total_token_count
                    parsable += AskGPT(email=userid, system_message=system_message, prompt=batch_prompt, temperature=0)


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
                fs.loc[fs['file_path'] == path, 'embedding'] = ''

    filtered_fs = fs[fs["embedding"] == '']

    stop_words = set(stopwords.words('english'))
    for ind in filtered_fs.index:
        if filtered_fs["role"][ind] != '':
            string_to_embed = filtered_fs["file_path"][ind] + filtered_fs["summary"][ind] + filtered_fs["role"][ind]
        else:
            string_to_embed = filtered_fs["file_path"][ind] +' '+ filtered_fs["summary"][ind]
        string_to_embed = ' '.join([word for word in string_to_embed.split() if word.lower() not in stop_words])
        file_path = filtered_fs.loc[ind, 'file_path']

        for fsindex in fs.index:
            if fs.iloc[fsindex]['file_path'] == file_path:
                x = str(split_embed(string_to_embed, userid))
                print("Type x")
                print(type(x))
                print("Type x2")
                print(type(fs.loc[fsindex]['embedding']))
                fs.loc[fs['file_path'] == file_path, 'embedding'] = x
                time.sleep(0.1)


    user_logger.log("Syncing file contents..")
    create_clone(read_info(userid).split("/")[-1], userid)

    fs.to_csv(fsfilename, index=False)
    return "DONE", list(new_file_paths)