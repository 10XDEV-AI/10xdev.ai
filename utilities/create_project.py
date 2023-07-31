from utilities.AskGPT import AskGPT
def create_project_with_clarity(prompt, clarifying_questions, user_answers):


    return code


def new_project(email, user_prompt):
    system_message = "Based on the give project description ask clarifying questions to the user"
    response = AskGPT(email, system_message, user_prompt)
    return response