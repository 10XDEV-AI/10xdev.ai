import requests
import boto3
def get_user_attributes(auth_code):
    # Define the endpoint URL for token exchange
    token_url = 'https://10xdevai.auth.eu-north-1.amazoncognito.com/oauth2/token'
    print(auth_code)
    # Define the required parameters for the token exchange
    payload = {
        'grant_type': 'authorization_code',
        'client_id': '591o1sd8eemo6o222hergcvnd0',
        'code': auth_code,
        'redirect_uri': 'https://10xdevai.eu-north-1.elasticbeanstalk.com/'
    }

    # Define the headers for the request (including the Authorization header)
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic vu1bfdor2ift9plqsfbidbash8i1e4j1j15vq3bhuutl0nbgtka'
    }

    # Send the POST request to exchange the authorization code for tokens
    response = requests.post(token_url, data=payload, headers=headers)
    print(response)
    # Check if the request was successful
    if response.status_code == 200:
        # Get the access token from the response
        access_token = response.json()['access_token']

        # Create a Cognito client
        client = boto3.client('cognito-idp', region_name='eu-north-1')

        # Get user attributes using the access token
        response = client.get_user(AccessToken=access_token)

        # Extract the desired attributes
        attributes = response['UserAttributes']
        username = None
        email = None

        for attribute in attributes:
            if attribute['Name'] == 'sub':
                username = attribute['Value']
            elif attribute['Name'] == 'email':
                email = attribute['Value']

        return username, email
    else:
        # Handle the case where the token exchange was not successful
        return None, None
