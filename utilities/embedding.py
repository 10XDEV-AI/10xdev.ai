import openai
import time

text_file = open("API_key.txt", "r")

openai.api_key = text_file.read()
text_file.close()

def get_embedding(task, delay):
    time.sleep(delay)
    task = str(task)
    try:
        response = openai.Embedding.create(
            input=task,
            model="text-embedding-ada-002")
        return response['data'][0]['embedding']
    except openai.errors.APIError as e:
        print(f"Error: {e}")
        print("Retrying after 5 seconds...")
        time.sleep(5)
        return get_embedding(task, delay)  # Retry after 5 seconds
