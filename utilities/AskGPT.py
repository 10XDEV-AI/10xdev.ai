import threading
import time
import openai

RATE_LIMIT = 3 # Change this to the rate limit set by the chat model
requests_made = 0
request_queue = []

def AskGPT(model = "gpt-3.5-turbo", system_message = '', prompt = 'Hi', temperature=0, max_tokens=256):
    global requests_made
    if requests_made >= RATE_LIMIT:
        request_queue.append((model, system_message, prompt, temperature, max_tokens))
        return "Rate limit reached. Your request has been queued."
    else:
        requests_made += 1
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
            print("Retrying in 20 seconds...")
            time.sleep(20)
        finally:
            requests_made -= 1

def process_requests():
    global requests_made
    while requests_made < RATE_LIMIT and request_queue:
        print("Processing request queue...")
        print(requests_made)
        request = request_queue.pop(0)
        AskGPT(*request)

def timer():
    while True:
        time.sleep(60)
        process_requests()

t = threading.Thread(target=timer)
t.start()
