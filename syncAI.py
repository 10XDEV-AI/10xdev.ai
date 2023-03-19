import openai
import os
import pandas as pd
import time
import numpy
import matplotlib
from openai.embeddings_utils import cosine_similarity

text_file = open("API_key.txt", "r")

# read dif.txt as a string
with open('dif.txt') as f:
    dif = f.read()