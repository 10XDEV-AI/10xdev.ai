from utilities.summarize import summarize_str, summarize_big
import os

sample_input_string = "This is a long piece of text that needs summarization. It contains multiple paragraphs and sentences..."
sample_filename = "sample.txt"
sample_email = "prathamthepro@gmail.com"

full_file_path = os.path.join("../user", sample_email, "motion-diffusion-model", "diffusion/gaussian_diffusion.py")


def test_summarize_big():
    try:
        with open(full_file_path, 'r') as f:
            file_contents = f.read()
        output = summarize_big(file_contents, sample_filename, sample_email)
        if output:
            print("Summarized output:")
            print(output)
        else:
            print("Summarization failed.")
    except Exception as e:
        print(f"An error occurred: {e}")

# Run the test
if __name__ == "__main__":
    test_summarize_big()