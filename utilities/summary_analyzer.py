import openai, time
from utilities.keyutils import get_key
from utilities.tokenCount import tokenCount
def analyze_system_messages(filename, string, email, userlogger):
    openai.api_key = get_key(email)
    max_attempts = 3
    attempt_count = 0

    system_messages = [
        {"role": "system", "content": "System message 1"},
        {"role": "system", "content": "System message 2"},
        {"role": "system", "content": "System message 3"}
    ]

    if tokenCount(str(string)) > 3500:
        model = "gpt-3.5-turbo-16k"
    else:
        model = "gpt-3.5-turbo"

    while attempt_count < max_attempts:
        try:
            response = openai.ChatCompletion.create(
                model=model,
                messages=system_messages + [{"role": "user", "content": "File " + filename + " has " + string}],
                temperature=0,
            )
            return response["choices"][0]["message"]["content"]
        except Exception as e:
            userlogger.log(f"Encountered error: {e}")
            userlogger.log("Retrying in 20 seconds...")
            time.sleep(20)
            attempt_count += 1

    userlogger.log("Exceeded maximum retry attempts.")
    return None

analyze_system_messages()