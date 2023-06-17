import openai
from utilities.keyutils import get_key
def generate_completion(prompt, email):
    openai.api_key = get_key(email)

    response = openai.Completion.create(
        model="text-ada-001",
        prompt=prompt,
        temperature=1,
        max_tokens=256,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    return response.choices[0].text.strip()
