import re
import pandas as pd
from utilities.create_project_summary import get_project_summary
from utilities.tokenCount import tokenCount
from utilities.AskGPT import AskGPT





def extract_role(path, role):
    # Strip the path and role of any non-allowed characters and convert / to \
    path = re.sub(r'[\:<>"|?*]', "", path)
    # Remove leading and trailing brackets
    path = re.sub(r"^\[(.*)\]$", r"\1", path)
    # Remove leading and trailing backticks
    path = re.sub(r"^`(.*)`$", r"\1", path)
    # Remove trailing ]
    path = re.sub(r"[\]\:]$", "", path)

    # Remove leading and trailing 'Role :' or 'Role:'
    role = re.sub(r"Role\s*:\s*", "", role, flags=re.IGNORECASE)

    path = path.replace("File Path :", "").replace("File Path:", "")
    role = role.replace("Role :", "").replace("Role:", "")

    return path, role


def evaluate_role(fs, userid, threshold, path):
    filtered_fs = fs[pd.isnull(fs["role"])]
    print("Evaluating role for " + userid + "`project. At path " +path)
    system_message = """You will be given a summary of a codebase, it's folder structure, few file paths and the summarised contents of the files. Your task is to evaluate what the role of each of the files is in the codebase.Then you will output the role of each file. Each file's role must strictly follow a markdown code block format: \nFile Path : FILEPATH\n```\nRole : ROLE\n```\nBefore you finish, double check that the role of all the file paths mentioned by the user has been clarified. Be concise.Answer in a short sentence."""
    
    batch_size_limit = 10000
    if len(filtered_fs) > threshold:
        prompt_string = get_project_summary( path, userid)
        total_token_count = tokenCount(prompt_string)

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
        regex = r"File Path:\s*([^\n]+)\n```[^\n]*\n(.+?)```"

        matches = re.finditer(regex, parsable, re.DOTALL)

        for match in matches:
            file_path, role = match.group(1).strip(), match.group(2).strip()
            fs.loc[fs['file_path'] == file_path, 'role'] = role
            fs.loc[fs['file_path'] == file_path, 'embedding'] = ''


        filtered_fs = fs[pd.isnull(fs["role"])]
        parsable = ''

        prompt_string = get_project_summary(path.split("/")[-1], userid)
        total_token_count = tokenCount(prompt_string)
        batch_size_limit = 10000
        
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
                prompt_string = get_project_summary(path.split("/")[-1], userid)
                total_token_count = tokenCount(prompt_string)
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
                    prompt_string = get_project_summary(path, userid)
                    total_token_count = tokenCount(prompt_string)                    
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

            regex = r"File Path:\s*([^\n]+)\n```[^\n]*\n(.+?)```"

            matches = re.finditer(regex, parsable, re.DOTALL)

            for match in matches:
                path, role = match.group(1).strip(), match.group(2).strip()
                fs.loc[fs['file_path'] == path, 'role'] = role
                fs.loc[fs['file_path'] == path, 'embedding'] = ''

    return fs