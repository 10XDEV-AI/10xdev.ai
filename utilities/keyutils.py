import json,os,time
import openai
from utilities.tokenCount import tokenCount
def set_key(key,userid):
    with open(os.path.join(userid,'AIFiles', 'info.json'), 'r') as f:
        data = json.load(f)
        data['api_key'] = key

    with open(os.path.join(userid,'AIFiles', 'info.json'), 'w') as outfile:
        json.dump(data, outfile)

    openai.api_key = data.get('key', None)

    return 'API key set successfully', 200

def delete_key(userid):
    with open(os.path.join(userid,'AIFiles', 'info.json'), 'r') as f:
        data = json.load(f)
        data['api_key'] = ''

    with open(os.path.join(userid,'AIFiles', 'info.json'), 'w') as outfile:
        json.dump(data, outfile)

    return 'API key deleted successfully', 200


def get_key(userid):
    with open(os.path.join(userid,'AIFiles','info.json'), 'r') as f:
        data = json.load(f)
        return data.get('api_key', None)


def test_key(key,userid):
    with open(os.path.join(userid,'AIFiles','info.json'), 'r') as f:
        data = json.load(f)
        old_key = data.get('api_key', None)
        print(old_key)

    openai.api_key = key

    model="gpt-3.5-turbo"
    system_message=""
    prompt="Hi"
    temperature=0
    max_tokens=256

    try:
        response = openai.ChatCompletion.create(
            model=model,
            messages=[{"role": "system", "content": system_message},
                      {"role": "user", "content": prompt}],
            temperature=temperature,
            max_tokens=max_tokens
        )

        if response is not None:
            openai.api_key = old_key
            return 'Your API Works 👍🏻'
    except Exception as e:
        return 'Your API does not work  ㅠㅠ'

