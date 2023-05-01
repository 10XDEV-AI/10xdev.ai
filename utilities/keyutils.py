import openai
from utilities.AskGPT import AskGPT
def set_key(key):
    with open('API_Key.txt', 'w') as f:
        api_key = key
        f.write(api_key)
    return 'API key set successfully',200

def delete_key():
    openai.api_key = None
    with open('API_Key.txt', 'w') as f:
        f.truncate(0)
    return 'API key deleted successfully',200

def test_key(key):
    print("Testing Key")
    print(key)
    openai.api_key = key
    response = str(AskGPT(model="gpt-3.5-turbo", system_message="", prompt="Hi", temperature=0, max_tokens=256))
    if len(response)!= 0:
        return 'Your API Works 👍🏻',200

