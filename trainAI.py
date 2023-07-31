import pandas as pd, os, openai, time
from utilities.embedding import split_embed
from utilities.create_clone import create_clone
from utilities.files2analyse import files2analyse, check_file_type
from utilities.tokenCount import tokenCount
from utilities.keyutils import get_key
from utilities.rates import get_rates
from  utilities.repoutils import select_repo
from utilities.notebook_utils import convert_ipynb_to_python
from utilities.create_project_summary import create_project_summary
def summarize_str(filename, string, email, userlogger):
    openai.api_key = get_key(email)
    max_attempts = 3
    attempt_count = 0
    if tokenCount(str(string)) > 3500:
        model = "gpt-3.5-turbo-16k"
    else:
        model = "gpt-3.5-turbo"

    while attempt_count < max_attempts:
        try:
            response = openai.ChatCompletion.create(
                model=model,
                messages=[
                    {"role": "system", "content": "Summarize what this file in the codebase does, assume context when necessary."},
                    {"role": "user", "content": "File " + filename + " has " + string}
                ],
                temperature=0,
            )
            return response["choices"][0]["message"]["content"]

        except Exception as e:
            userlogger.log(f"Encountered error: {e}")
            userlogger.log("Retrying in 20 seconds...")
            time.sleep(20)
            attempt_count += 1

    userlogger.log("Exceeded maximum retry attempts.")
    return None

def summarize_file(repo_name, filepath, i, userlogger, email):
    full_file_path = os.path.join("../user", email, repo_name, filepath)

    if not check_file_type(full_file_path):
        print("File " + filepath + " was not summarized as it is not a text file")
        p = ("File " + filepath + " was not Analyzed as it is not a text file")
        userlogger.log(p)
        return i, "Ignore"

    i += 1
    p = ("Analyzing " + filepath)
    userlogger.log(p)

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

    if tokenCount(file_contents) > 15000:
        p = ("File " + filepath + " was not analyzed as it is too long")
        userlogger.log(p)
        return i, "File content too long"

    return i, summarize_str(filepath, file_contents, email, userlogger)


def train_AI(repo_name, userlogger, email):
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
    chat_limit = get_rates(email).split(",")[0]
    i = 0
    fs['summary'] = ''
    fs['embedding'] = ''
    userlogger.log("Starting analysis")

    for ind in fs.index:
        i_new, fs['summary'][ind] = summarize_file(repo_name, fs['file_path'][ind], i, userlogger, email)
        if fs['summary'][ind] != "Ignore":
            fs['embedding'][ind] = split_embed(fs['file_path'][ind]+" "+fs['summary'][ind], email)
        if i_new != i:
            i = i_new
        if i != 0:
            rate = 60 * i / (time.time() - start_time)
            time_elapsed = time.time() - start_time
            p = (str(round(100 * (ind + 1) / len(fs))) + "% done. Rate:"+ str(round(rate, 2)) + " requests/min. Time Elapsed: " + str(round(time_elapsed / 60, 2)))
            print(p)
            userlogger.log(p)

    fs = fs[fs['summary'] != "Ignore"]

    userlogger.log("Analyzed all files successfully")

    fs.to_csv(fsfilename, index=False)

    select_repo(repo_name,email)
    create_project_summary(repo_name,email)
    print("100% Done")
    create_clone(repo_name, email)
    userlogger.clear_logs()
    userlogger.log("-----------------------------------------------------")
    userlogger.log("Your repo was trained into the AI successfully")
    userlogger.log("-----------------------------------------------------")
    time.sleep(2)
    userlogger.clear_logs()
    return
