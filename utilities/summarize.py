import openai, os, time, langchain
from utilities.keyutils import get_key
from utilities.tokenCount import tokenCount
from utilities.notebook_utils import convert_ipynb_to_python
from utilities.files2analyse import check_file_type

def summarize_big(input_string, filename, email):
    from langchain.chat_models import ChatOpenAI
    llm = ChatOpenAI(temperature=0, openai_api_key=get_key(email), model_name="gpt-3.5-turbo-16k")
    from langchain.chains.summarize import load_summarize_chain
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    input_string = "File Path : " + filename + "\n" + input_string

    # Initialize the text splitter
    text_splitter = RecursiveCharacterTextSplitter(separators=["\n\n", "\n"], chunk_size=10000, chunk_overlap=500)

    # Create documents from the split chunks
    docs = text_splitter.create_documents([input_string])
    num_docs = len(docs)

    # Initialize the summarize chain with map_reduce
    summary_chain = load_summarize_chain(llm=llm, chain_type='refine')
    output = summary_chain.run(docs)
    return output


def summarize_str(filename, string, email, userlogger):
    openai.api_key = get_key(email)
    max_attempts = 3
    attempt_count = 0
    if tokenCount(str(string))>12000:
        return summarize_big(string, filename, email)
    if tokenCount(str(string)) > 3500:
        model = "gpt-3.5-turbo-16k"
    else:
        model = "gpt-3.5-turbo"

    while attempt_count < max_attempts:
        try:
            response = openai.ChatCompletion.create(
                model=model,
                messages=[
                    {"role": "system", "content": "Summarize the contents of this file in a paragraph."},
                    {"role": "user", "content": "File " + filename + " has " + string}
                ],
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

def summarize_file(repo_name, filepath, i, userlogger, email):
    full_file_path = os.path.join("../user", email, repo_name, filepath)

    if not check_file_type(full_file_path):
        print("File " + filepath + " was not summarized as it is not a text file")
        p = ("File " + filepath + " was not Analyzed as it is not a text file")
        userlogger.log(p)
        return i, "Ignore"

    i += 1

    if filepath.endswith(".ipynb"):
        # Convert .ipynb file to human-readable format
        file_contents = convert_ipynb_to_python(full_file_path)
    else:
        with open(full_file_path, 'r') as f:
            try:
                file_contents = f.read()
            except UnicodeDecodeError:
                p = ("File " + filepath + " was not Analyzed as it is not a text file")
                userlogger.log(p)
                return i, "Ignore"

    if tokenCount(file_contents) > 60000:
        p = ("File " + filepath + " was not analyzed as it is too long")
        userlogger.log(p)
        return i, "File content too long"

    return i, summarize_str(filepath, file_contents, email, userlogger)
