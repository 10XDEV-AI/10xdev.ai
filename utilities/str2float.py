
def str2float(embedding_str):
    if embedding_str == "nan":
        return None
    # Split the string into separate vectors
    embedding_split = embedding_str.strip('[]').split('], [')
    #print(embedding_split)
    if embedding_split == ['']:
        return None
    # Convert the string vectors to lists of floats
    embedding_lists = [list(map(float, v.split(', '))) for v in embedding_split]
    return embedding_lists