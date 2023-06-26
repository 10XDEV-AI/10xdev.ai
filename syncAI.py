import time, subprocess, os, pandas as pd
from utilities.projectInfo import read_info
from utilities.embedding import split_embed
from utilities.create_clone import create_clone, get_clone_filepath
from utilities.str2float import str2float
from utilities.AskGPT import AskGPT
from utilities.files2analyse import check_file_type, files2analyse
from utilities.rates import get_rates
import difflib

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
    system_message = "Summarize what this file in the codebase does, assume context when neccessary."
    return AskGPT(userid, system_message=system_message, prompt=prompt, temperature=0,max_tokens=380)


def sumarize(filename, userid):
    root = read_info(userid)
    if not check_file_type(os.path.join(root,filename)):
        print("File " + filename + " was not summarised as it is not a text file")
        return "Ignore"
    with open(os.path.join(root,filename), 'r') as f:
        try:
            file_contents = f.read()
        except UnicodeDecodeError:
            print("File " + filename + " was not summarised as it is not a text file")
            return "Ignore"
    return summarize_str(filename, file_contents, userid)

def syncAI(sync_flag, user_logger, userid):
    path = read_info(userid)
    if path == "" or path is None:
        print("No path for user " + userid)
        return "DONE", []

    # git pull at path
    subprocess.run(["git", "pull"], cwd=path)

    branches_output = subprocess.check_output(["git", "branch"], cwd=path).decode("utf-8")
    branches = branches_output.split("\n")
    current_branch = subprocess.check_output(["git", "symbolic-ref", "--short", "HEAD"], cwd=path).decode("utf-8").strip()

    for branch in branches:
        branch_name = branch.strip()
        if branch_name != "" and branch_name != current_branch:
            subprocess.run(["git", "branch", "-D", branch_name], cwd=path)
            print(f"Deleted local branch: {branch_name}")


    global fs
    fsfilename = "../user/" + userid + "/AIFiles/" + path.split("/")[-1] + ".csv"
    chat_limit = get_rates(userid).split(",")[0]
    delay = 60 / int(chat_limit)
    fs = pd.read_csv(fsfilename)
    fs["embedding"] = fs.embedding.apply(lambda x: str2float(str(x)))

    file_paths_details = files2analyse(path.split("/")[-1], userid)

    for file in file_paths_details:
        clone_path = get_clone_filepath(userid, path.split("/")[-1], file)
        if get_diff(os.path.join(path, file), clone_path) is not None:
            print("File " + file + " has changed")
            user_logger.log("File " + file + " has changed. Syncing AI...")
            summary = sumarize(file, userid)
            if summary == "Ignore":
                continue
            fs["summary"][fs["file_path"] == file] = summary
            fs["embedding"][fs["file_path"] == file] = pd.Series(split_embed(summary, userid))
            time.sleep(delay)

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

        del_file_paths = set(fs["file_path"]) - set(file_paths_details)

        # Iterate over the del_file_paths set and remove the corresponding rows from dataframes
        for file_path in del_file_paths:
            fs = fs[fs["file_path"] != file_path]
            print("Deleted File: " + str(file_path))

        new_fs["embedding"] = ""
        new_fs["summary"] = ""
        for ind in new_fs.index:
            user_logger.log("Analyzing New File: " + new_fs["file_path"][ind])
            new_fs["summary"][ind] = sumarize(new_fs["file_path"][ind], userid)
            if new_fs["summary"][ind] != "Ignore":
                print(new_fs["file_path"][ind] + " is being embedded")
                new_fs["embedding"][ind] = split_embed(new_fs["summary"][ind], userid)
            time.sleep(delay)

        fs = pd.concat([fs, new_fs], ignore_index=True)

    fs.to_csv(fsfilename, index=False)
    create_clone(read_info(userid).split("/")[-1], userid)
    user_logger.clear_logs()
    return "DONE", list(new_file_paths)
