import json,os
import openai
from utilities.AskGPT import AskGPT

def set_key(key):
    with open(os.path.join('AIFiles', 'info.json'), 'r') as f:
        data = json.load(f)
        data['api_key'] = key

    with open(os.path.join('AIFiles', 'info.json'), 'w') as outfile:
        json.dump(data, outfile)

    openai.api_key = data.get('key', None)

    return 'API key set successfully', 200


def delete_key():
    with open(os.path.join('AIFiles', 'info.json'), 'r') as f:
        data = json.load(f)
        data['api_key'] = ''

    with open(os.path.join('AIFiles', 'info.json'), 'w') as outfile:
        json.dump(data, outfile)

    return 'API key deleted successfully', 200



def test_key(key):
    with open(os.path.join('AIFiles','info.json'), 'r') as f:
        data = json.load(f)
        old_key = data.get('api_key', None)
        print(old_key)

    openai.api_key = key
    response = AskGPT(model="gpt-3.5-turbo", system_message="", prompt="Hi", temperature=0, max_tokens=256, retrys=0)
    if response is not None:
        openai.api_key = old_key
        print(response)
        return 'Your API Works 👍🏻', 200
    else:
        openai.api_key = old_key
        return 'Issues with key, please check if the key works on OpenAI Playground first', 404


def get_key():
    with open(os.path.join('AIFiles','info.json'), 'r') as f:
        data = json.load(f)
        return data.get('api_key', None)
