import time
import openai
from utilities.keyutils import get_key
from utilities.tokenCount import tokenCount

def AskGPT(email, system_message="", prompt="Hi", temperature=0, max_tokens=-1, retrys=3, delay=20,model = "gpt-3.5-turbo"):
    if tokenCount(str(prompt) + str(system_message)) > 2500:
        if tokenCount(str(prompt) + str(system_message)) > 15000:
            return "There was an error with token limits. Please try again with another prompt."
        model = "gpt-3.5-turbo-16k"

    openai.api_key = get_key(email)
    try:
        if max_tokens == -1:
            response = openai.ChatCompletion.create(
                model=model,
                messages=[{"role": "system", "content": system_message},
                          {"role": "user", "content": prompt}],
                temperature=temperature
            )
            if tokenCount(system_message+prompt+response["choices"][0]["message"]['content'])>4090 and model == "gpt-3.5-turbo":
                time.sleep(delay)
                print("Retrying in %f seconds with larger model", delay)
                return AskGPT(email, system_message, prompt, temperature, max_tokens, retrys, delay, model = "gpt-3.5-turbo-16k")
            else:
                return response["choices"][0]["message"]['content']
        else:
            response = openai.ChatCompletion.create(
                model=model,
                messages=[{"role": "system", "content": system_message},
                          {"role": "user", "content": prompt}],
                temperature=temperature,
                max_tokens=max_tokens,
                top_p=1,
                frequency_penalty=0,
                presence_penalty=0
            )
        return response["choices"][0]["message"]['content']
    except Exception as e:
        print(f"Encountered error: {e}")
        if "maximum context length" in str(e):
            time.sleep(delay)
            print("Retrying in %f seconds wit larger model", delay)
            return AskGPT(email, system_message, prompt, temperature, max_tokens, retrys - 1, delay, model = "gpt-3.5-turbo-16k")
        elif retrys >= 0:
            print("Retrying in %f seconds...", delay)
            time.sleep(delay)
            return AskGPT(email, system_message, prompt, temperature, max_tokens, retrys - 1, delay)
        else:
            return "Sorry, there was an error. Please try again later."
