import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Apis.css';
import Navbar from '../Navbar';

export default function Apis() {
  const navigate = useNavigate();
  const [api, setApi] = useState(null);
  const [apikey, setApikey] = useState('');

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/`)
      .then(response => response.json())
      .then(data => setApi(data))
      .catch(error => console.error(error));
  }, []);

  const deleteKey = () => {
    fetch(`http://127.0.0.1:5000/api/deleteKey`)
      .then(() => {window.location.reload();})
      .catch(error => console.error(error));
  };

  const testKey = () => {
    fetch(`http://127.0.0.1:5000/api/testKey?$apikey={apikey}`, {
     method: 'GET',
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
  };

  const setKey = () => {
    fetch(`http://127.0.0.1:5000/api/setKey?${apikey}`)
      .then(response => response.json())
      .then(data => console.log(data))
      .then(() => {window.location.reload();})
      .catch(error => console.error(error));
  };

  const handleApikeyChange = event => {
    setApikey(event.target.value);
  }

  return (
    <div>
      <Navbar LoadSync=""/>
      <div className="keys-container">
        <h1 className="keys-title">API Key</h1>
        <div className="key-card">
          {!api &&
            <div>
              <p> Setup OpenAI API Key</p>
              <input type="text" name="api" id="api" value={apikey} onChange={handleApikeyChange} />
              <button onClick={testKey}>Test API Key</button>
              <button onClick={setKey}>Set API Key</button>
            </div>
          }
          {api && (
            <>
              <p>Your API key is: {api}</p>
              <button onClick={testKey}>Test API Key</button>
              <button onClick={deleteKey}>Delete API Key</button>
            </>
          )}
        </div>
        <div className="repos-button-container">
          <button className="repos-button" onClick={() => navigate('/')}>Ask AI</button>
        </div>
      </div>
    </div>
  );
}
