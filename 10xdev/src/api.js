import Cookies from 'js-cookie';
import React from 'react';
import ReactDOM from 'react-dom';
import Alert from './UiComponents/alert';

export const callAPI = async (url, options = {}) => {
  const code = Cookies.get('cognitoCode');
  const headers = {
    Authorization: `Bearer ${code}`,
    'Content-Type': 'application/json',
    ...options.headers, // Merge additional headers passed in options
  };
  const response = await fetch(url, { ...options, headers });
  if(!response.ok){
      showAlert( response.status );
  }
  const data = await response.json();

  return data;
};

function showAlert(type) {
  const alertContainer = document.getElementById('alert-container');
  ReactDOM.render(
    <Alert  type={type} />,
    alertContainer
  );

  setTimeout(() => {
    ReactDOM.unmountComponentAtNode(alertContainer);
  }, 5000);
}
