import time
import openai
from utilities.keyutils import get_key
from utilities.tokenCount import tokenCount


def AskGPT(email, system_message="", prompt="Hi", temperature=0, max_tokens=256, retrys=3, delay=20):
    if tokenCount(str(prompt) + str(system_message)) > 2500:
        if tokenCount(str(prompt) + str(system_message)) > 15000:
            return "There was error with token limits, Please try again with another prompt"
        model = "gpt-3.5-turbo-16k"
    else:
        model = "gpt-3.5-turbo"

    openai.api_key = get_key(email)
    try:
        response = openai.ChatCompletion.create(
            model=model,
            messages=[{"role": "system", "content": system_message},
                      {"role": "user", "content": prompt}],
            temperature=temperature,
            max_tokens=max_tokens
        )
        return response["choices"][0]["message"]['content']
    except Exception as e:
        print(f"Encountered error: {e}")
        if retrys >= 0:
            print("Retrying in %f seconds...",delay)
            time.sleep(delay)
            return AskGPT(email, system_message, prompt, temperature, max_tokens, retrys - 1, delay)
        else:
            return "Sorry, there was an error. Please try again later."
