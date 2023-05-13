from utilities.embedding import split_embed

if __name__ == "__main__":
    #sample chapter summaries
    summary = "The AI revolution has been a significant success, and the world is now a better place. It’s time to take the next step in the evolution of the world."

    final_summary = ""
    word_count = 0
    for i in range(0,18):
        final_summary += summary
        word_count += len(summary.split())

    e = split_embed(final_summary)
    count = 0
    for i in e:
        count += len(i)

    print("Word count: ", word_count)
    print("Embedding vector count: ", word_count/8)
    print("Length: ", len(e))
    print("Count: ", count)
