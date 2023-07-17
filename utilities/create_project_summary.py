import pandas as pd


def create_project_summary(repo_name, email):
    filename = "../user/" + email + "/AIFiles/" + repo_name.split('/')[-1] + ".csv"
    fs = pd.read_csv(filename)

