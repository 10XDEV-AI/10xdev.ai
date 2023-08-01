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
    prompt += "User : " project_prompt
    prompt += "AI : "+ clarifying_questions
    return AskGPT(email, system_message=spec_prompt, prompt=prompt)

def new_project(email, user_prompt):
    system_message = "Based on the give project description ask clarifying questions to the user"
    response = AskGPT(email, system_message, user_prompt)
    return response