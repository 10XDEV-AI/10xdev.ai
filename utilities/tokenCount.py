import tiktoken

def tokenCount(string: str) -> int:
    encoding_name = "cl100k_base"
    string = " ".join(string.split())
    encoding = tiktoken.get_encoding(encoding_name)
    num_tokens = len(encoding.encode(string))
    return num_tokens