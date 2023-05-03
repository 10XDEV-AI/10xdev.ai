import queue,os,json
import threading
import time
import openai

with open(os.path.join('AIFiles','info.json'), 'r') as f:
    data = json.load(f)
    chat_limit,embedding_limit = data['rates'].split(',')
    openai.api_key = data.get('api_key', None)

MAX_BATCH_SIZE = embedding_limit  # maximum number of requests to make in a batch
RATE_LIMIT_INTERVAL = embedding_limit  # interval in seconds for rate limiting

def split_sent(s1):
    words = s1.split()  # split string into words
    n = 8  # split every n words
    chunks = [words[i:i+n] for i in range(0, len(words), n)]  # split into chunks of size n
    result = [' '.join(chunk) for chunk in chunks]  # join chunks into strings
    return result

def get_embedding(task):
    task = str(task)
    try:
        response = openai.Embedding.create(
            input=task,
            model="text-embedding-ada-002")
        return response['data'][0]['embedding']
    except Exception as e:
        print(f"Error: {e}")
        print("Retrying after 5 seconds...")
        time.sleep(5)
        return get_embedding(task)  # Retry after 5 second s

def process_batch(batch, results_queue):
    embeddings = []
    for task in batch:
        embedding = get_embedding(task)
        if embedding is not None:
            embeddings.append(embedding)
    results_queue.put(embeddings)

def split_embed(summary):
    if summary == "Ignore":
        summary = ""
    sentences = split_sent(summary)
    sentences = [x for x in sentences if x != '']

    # Create a queue to store requests for embeddings
    requests_queue = queue.Queue()
    for sentence in sentences:
        requests_queue.put(sentence)

    # Create a queue to store results
    results_queue = queue.Queue()

    # Keep track of rate limiting
    last_rate_limit_time = time.time()
    num_requests_made = 0

    # Process requests in batches
    while not requests_queue.empty():
        batch = []
        while len(batch) < MAX_BATCH_SIZE and not requests_queue.empty():
            batch.append(requests_queue.get())

        # Check if rate limit is exceeded
        time_since_last_rate_limit = time.time() - last_rate_limit_time
        if time_since_last_rate_limit < RATE_LIMIT_INTERVAL and num_requests_made + len(batch) > MAX_BATCH_SIZE:
            time_to_wait = RATE_LIMIT_INTERVAL - time_since_last_rate_limit
            time.sleep(time_to_wait)
            last_rate_limit_time = time.time()
            num_requests_made = 0

        # Make API calls in parallel
        threads = []
        for i in range(len(batch)):
            thread = threading.Thread(target=process_batch, args=([batch[i:i+1]], results_queue))
            threads.append(thread)
            thread.start()
        for thread in threads:
            thread.join()

        num_requests_made += len(batch)

    # Combine results from all batches
    sentence_embeddings = []
    while not results_queue.empty():
        sentence_embeddings += results_queue.get()
    return sentence_embeddings
