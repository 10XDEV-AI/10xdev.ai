import Cookies from 'js-cookie';

export const callAPI = async (url, options = {}) => {
  const code = Cookies.get('cognitoCode');

  const headers = {
    Authorization: `Bearer ${code}`,
    'Content-Type': 'application/json',
    ...options.headers, // Merge additional headers passed in options
  };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  return data;
};
