import json
import os

DEFAULT_RATES = [3, 60]

def set_rates(rates,email):
    with open(os.path.join("user", email,'AIFiles', 'info.json'), 'r') as f:
        data = json.load(f)
        data['rates'] = rates

    with open(os.path.join("user", email,'AIFiles', 'info.json'), 'w') as outfile:
        json.dump(data, outfile)

    return 'Rates set successfully', 200

def get_rates(userid):
    with open(os.path.join("user", userid,'AIFiles', 'info.json'), 'r') as f:
        data = json.load(f)
        rates = data.get('rates', None)
        if rates is None:
            rates = DEFAULT_RATES
        return rates
