import openai
import time


def AskGPT(model = "gpt-3.5-turbo", system_message = '', prompt = 'Hi', temperature=0, max_tokens=256):
    while True:
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

            log(f"Encountered error: {e}")
            log("Retrying in 20 seconds...")
            time.sleep(20)