import pandas as pd, os, time, re
from utilities.embedding import split_embed
from utilities.create_clone import create_clone
from utilities.files2analyse import files2analyse
from  utilities.repoutils import select_repo
from utilities.create_project_summary import create_project_summary
from utilities.summarize import summarize_file
from utilities.mixpanel import track_event
from nltk.corpus import stopwords
from utilities.role_analyzer import evaluate_role
from multiprocessing import Pool

summarize_file_count = 0
start_time = time.time()

def summarize_file_parallel(args):
    global summarize_file_count
    repo_name, file_path, i, userlogger, email = args
    i_new, summary = summarize_file(repo_name, file_path, i, userlogger, email)
    return i_new, summary


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
    fs['role'] = None
    userlogger.log("Starting analysis", percent="0", time_left="0")

    num_processes = os.cpu_count()
    pool = Pool(processes=num_processes)
    results = []
    global summarize_file_count
    for ind in fs.index:
        args = (repo_name, fs['file_path'][ind], i, userlogger, email)
        results.append(pool.apply_async(summarize_file_parallel, (args,)))

        # Increment the count of summarize_file calls
        summarize_file_count += 1

        # Check if the rate limit has been reached
        if summarize_file_count > 10:
            # Calculate the time elapsed since the last minute
            time_elapsed = time.time() - start_time

            # If the time elapsed is less than a minute, sleep for the remaining time
            if time_elapsed < 60:
                time.sleep(60 - time_elapsed)
            
            # Reset the summarize_file count
            summarize_file_count = 0

    for ind, result in enumerate(results):
        i_new, summary = result.get()
        fs['summary'][ind] = summary
        if i_new != i:
            i = i_new
            if i != 0:
                time_elapsed = time.time() - start_time
                p = str(round(100 * (ind + 1) / len(fs)))
                t = str(round(time_elapsed / 60, 2))
                log_str = "Analyzing " + fs['file_path'][ind]
                userlogger.clear_logs()
                userlogger.log(log_str, percent=p, time_left=t)

    pool.close()
    pool.join()
    fs = fs[fs['summary'] != "Ignore"]

    fs.to_csv(fsfilename, index=False)
    create_project_summary(repo_name,email)
    
    fs = evaluate_role(fs, email, 0, path)

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