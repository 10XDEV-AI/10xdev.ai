import queue
import threading
import time, math
import openai
from utilities.keyutils import get_key
from utilities.rates import get_rates

MAX_BATCH_SIZE = 55
RATE_LIMIT = 60


def split_sent(s1):
    words = s1.split()  # split string into words
    n = 8  # split every n words
    chunks = [words[i:i + n] for i in range(0, len(words), n)]  # split into chunks of size n
    result = [' '.join(chunk) for chunk in chunks]  # join chunks into strings
    return result


def get_embedding(task, userid):
    openai.api_key = get_key(userid)
    chat_limit, embedding_limit = get_rates(userid).split(",")
    global MAX_BATCH_SIZE, RATE_LIMIT
    MAX_BATCH_SIZE = math.floor(0.95 * int(embedding_limit))  # maximum number of requests to make in a batch
    RATE_LIMIT = int(embedding_limit)  # interval in seconds for rate limiting

    task = str(task)
    try:
        response = openai.Embedding.create(
            input=task,
            model="text-embedding-ada-002")
        return response['data'][0]['embedding']
    except Exception as e:
        print(f"Error: {e}")
        print("Retrying")
        time.sleep(60 / RATE_LIMIT)
        return get_embedding(task,userid)  # Retry after 5 second s


def process_batch(batch, results_queue, userid):
    embeddings = []
    for task in batch:
        embedding = get_embedding(task, userid)
        if embedding is not None:
            embeddings.append(embedding)
    results_queue.put(embeddings)


def split_embed(summary, userid):
    global MAX_BATCH_SIZE
    if summary == "Ignore":
        summary = ""
    sentences = split_sent(summary)
    sentences = [x for x in sentences if x != '']
    sentence_embeddings = []

    # Create a queue to store requests for embeddings
    requests_queue = queue.Queue()
    for sentence in sentences:
        requests_queue.put(sentence)


    # Create a queue to store results
    results_queue = queue.Queue()

    # Keep track of rate limiting
    num_requests_made = 0

    # Process requests in batches
    while not requests_queue.empty():
        batch = []
        while len(batch) < MAX_BATCH_SIZE and not requests_queue.empty():
            batch.append(requests_queue.get())

        print("Created a batch of size", len(batch))

        if num_requests_made >= MAX_BATCH_SIZE:
            time.sleep(60)
            num_requests_made = 0

        # Make API calls in parallel
        threads = []
        for i in range(len(batch)):
            thread = threading.Thread(target=process_batch, args=([batch[i:i + 1]], results_queue, userid))
            threads.append(thread)
            thread.start()
        for thread in threads:
            thread.join()

        num_requests_made += len(batch)

        # Combine results from all batches

        while not results_queue.empty():
            sentence_embeddings += results_queue.get()

        print("Combined results for batch of  size " + str(num_requests_made))

    return sentence_embeddings
