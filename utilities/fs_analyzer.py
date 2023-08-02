
import pandas as pd

def analyze_summaries(repo_name, email):
    # Load the AIFiles CSV file for the repo
    fs_filename = "../../user/" + email + "/AIFiles/" + repo_name + ".csv"
    fs = pd.read_csv(fs_filename)

    # Filter out ignored files
    fs = fs[fs['summary'] != "Ignore"]

    # Perform analysis on the summaries
    # You can add your own analysis logic here

    # Print the file summaries
    print("File Summaries:")
    for index, row in fs.iterrows():
        print(row['file_path'] + ": " + row['summary'])

    # Example: Count the number of files with summaries
    num_files_with_summaries = len(fs)
    print("Number of files with summaries:", num_files_with_summaries)

    # Example: Calculate the average length of summaries
    avg_summary_length = fs['summary'].apply(lambda x: len(x)).mean()
    print("Average summary length:", avg_summary_length)

    # Example: Get the most common words in the summaries
    word_counts = fs['summary'].str.split().explode().value_counts()
    print("Most common words in summaries:")
    print(word_counts.head(10))

# Example usage
repo_name = "10xdev.ai"
email = "prathamthepro@gmail.com"
analyze_summaries(repo_name, email)