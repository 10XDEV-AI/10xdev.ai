import pandas as pd
from utilities.AskGPT import AskGPT
from utilities.folder_tree_structure import generate_folder_structure

def create_project_summary(repo_name, email):
    filename = "../user/" + email + "/AIFiles/" + repo_name.split('/')[-1] + ".csv"
    fs = pd.read_csv(filename)

    # Get the file paths and summaries from the fs dataframe
    file_paths = fs['file_path'].tolist()
    summaries = fs['summary'].tolist()

    # Generate the folder tree structure
    folder_tree = generate_folder_structure(email, repo_name)

    # Create the input prompt
    prompt = "Below is a list of file paths and their summaries. \n\n"
    prompt += "File paths:\n"
    for i, (file_path, summary) in enumerate(zip(file_paths, summaries), 1):
        prompt += f"{file_path}\n"
        prompt += f"{summary}\n"

    prompt += "\nFolder tree structure:\n"
    prompt += folder_tree+"\nTask For you: Come up with a Project summary on what the project does. Highlight the project architecture. Note down different folders and components of the project based on file paths."

    project_summary = AskGPT(email=email, prompt=prompt)

    # Save the project summary to a file
    summary_file_path = "../user/" + email + "/AIFiles/" + repo_name.split('/')[-1] + "_full_project_info.txt"

    with open(summary_file_path, 'w') as file:
        file.write(project_summary)