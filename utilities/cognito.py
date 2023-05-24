import boto3

def get_user_attributes(access_token):
    # Create a Cognito client using boto3
    client = boto3.client('cognito-idp', region_name='eu-north-1')

    try:
        # Get the user information using the access token
        response = client.get_user(AccessToken=access_token)

        # Extract the email from the response
        email = None
        print(response)
        print(response['UserAttributes'])
        for attribute in response['UserAttributes']:
            if attribute['Name'] == 'email':
                email = attribute['Value']

        return email
    except Exception as e:
        print(e)
        return None

