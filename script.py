import os
import openai
import requests
import subprocess
 #   Add a new button with text "SurpriseMe" to the code


cmd = "git branch"
subprocess.call(cmd.split(), shell=False)


task = input("Describe a change you would want to be implemented : ")
tag = input("Enter tags about the component (#HTML or #CSS) :")
task_id = input("Enter Task ID : ")

def make_changes(path, task):
    # Open the file in read mode
    with open(path, 'r') as file:
        # Read the contents of the file
        file_contents = str(file.read())

    openai.api_key = "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"
    response=openai.Edit.create(
      model="code-davinci-edit-001",
      input=file_contents,
      instruction=task
    )
    new_code = response["choices"][0]["text"]

    # Open the file in write mode
    file = open(path, "w")
    # Write the string to the file
    file.write(new_code)
    # Close the file
    file.close()

    return "Task completed successfully."

def branch_out(task):
    cmd = "git checkout -b " + task_id
    subprocess.call(cmd.split(), shell=False)

def push():
    cmd = "git add ."
    subprocess.call(cmd.split(), shell=False)
    cmd = "git commit -m " + task_id
    subprocess.call(cmd.split(), shell=False)
    cmd = "git push --set-upstream origin " + task_id
    subprocess.call(cmd.split(), shell=False)
# Use the chosen option
if tag == "#HTML":
     path = "index.html"
     branch_out(task_id)
     make_changes(path,task)
     push()
elif tag == "#CSS":
     path = "css/style.css"
     branch_out(task_id)
     make_changes(path,task)
     push()
else:
    print("Invalid tag selected. Please choose from #HTML or #CSS.")
