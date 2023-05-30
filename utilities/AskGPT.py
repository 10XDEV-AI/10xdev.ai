import time
import openai
from utilities.keyutils import get_key
from utilities.tokenCount import tokenCount


def AskGPT(email, model="gpt-3.5-turbo", system_message='', prompt='Hi', temperature=0, max_tokens=256, retrys=3, delay=20):
    if tokenCount(prompt + system_message) > 4096:
        return "Your files are too long. Please try again with a shorter prompt, we will support GPT-4 soon."
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
        if retrys > 0:
            print("Retrying in %f seconds...",delay)
            time.sleep(delay)
            return AskGPT(model, system_message, prompt, temperature, max_tokens, retrys - 1, delay)
