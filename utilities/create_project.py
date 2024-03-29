from utilities.AskGPT import AskGPT
def create_project_with_clarity(email, project_prompt, clarifying_questions, user_answers):
    spec_prompt = """
    You are a super smart developer. Based on the above conversation between AI and User, You have been asked to make a specification for a program.
    
    Think step by step to make sure we get a high quality specification and we don't miss anything.
    First, be super explicit about what the program should do, which features it should have
    and give details about anything that might be unclear. **Don't leave anything unclear or undefined.**
    
    Second, lay out the names of the core classes, functions, methods that will be necessary,
    as well as a quick comment on their purpose.
    
    This specification will be used later as the basis for the implementation.
    """
    prompt = "AI : Describe a project you want to be implemented"
    prompt += "User : " + project_prompt
    prompt += "AI : "+ clarifying_questions
    answer =  AskGPT(email, system_message=spec_prompt, prompt=prompt)

    return answer

def create_project_with_spec(email, spec):
    system_message = """
    You will get instructions for code to write.
    You will write a very long answer. Make sure that every detail of the architecture is, in the end, implemented as code.
    
    Think step by step and reason yourself to the right decisions to make sure we get it right.
    You will first lay out the names of the core classes, functions, methods that will be necessary, as well as a quick comment on their purpose.
    
    Then you will output the content of each file including ALL code.
    Each file must strictly follow a markdown code block format, where the following tokens must be replaced such that
    FILENAME is the lowercase file name including the file extension,
    LANG is the markup code block language for the code's language, and CODE is the code:
    
    FILENAME
    ```LANG
    CODE
    ```
    
    Do not comment on what every file does
    
    You will start with the "entrypoint" file, then go to the ones that are imported by that file, and so on.
    Please note that the code should be fully functional. No placeholders.
    
    Follow a language and framework appropriate best practice file naming convention.
    Make sure that files contain all imports, types etc. Make sure that code in different files are compatible with each other.
    Ensure to implement all code, if you are unsure, write a plausible implementation.
    Include module dependency or package manager dependency definition file.
    Before you finish, double check that all parts of the architecture is present in the files.
    """

    answer = AskGPT(email, system_message=system_message, prompt=spec, model = "gpt-3.5-turbo-16k")
    print(answer)
    return answer

def new_project(email, user_prompt):
    system_message = "Based on the give project description ask clarifying questions to the user, so that you can generate a code base for that project"
    response = AskGPT(email, system_message, user_prompt)
    return response

import re

def parse_chat(chat):
    regex = r"(\S+)\n\s*```[^\n]*\n(.+?)```"
    matches = re.finditer(regex, chat, re.DOTALL)

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
        code = match.group(2)

        # Add the file to the list
        files.append((path, code))

    # Get all the text before the first ``` block
    readme = chat.split("```")[0]
    files.append(("README.md", readme))

    # Return the files
    return files


def to_files(chat, workspace):
    workspace["all_output.txt"] = chat

    files = parse_chat(chat)
    for file_name, file_content in files:
        workspace[file_name] = file_content


import zipfile

def to_zip(chat):
    # Convert chat to files
    workspace = {}
    to_files(chat, workspace)

    # Create a new zip folder
    with zipfile.ZipFile("files.zip", "w") as zipf:
        # Iterate through the files in the workspace
        for filename, content in workspace.items():
            # Add each file to the zip folder
            zipf.writestr(filename, content)