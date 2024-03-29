import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Apis.css';
import Navbar from '../Navbar';
import { callAPI } from '../api';

export default function Apis() {
  const navigate = useNavigate();
  const [api, setApi] = useState(null);
  const [apikey, setApikey] = useState('');
  const [message, setMessage] = useState('');
  const [newRates, setNewRates] = useState([]);

  useEffect(() => {
    (async function() {
      try {
        const data = await callAPI('/api/getKey');
        setApi(data);
        console.log(data);
        const data2 = await callAPI('/api/getRates');
        console.log(data2);
        setNewRates([data2]);
        console.log(newRates);
      } catch (error) {
        console.error(error);
      }
      setMessage('');
    })();
  }, []);

  const deleteKey = () => {
    callAPI('/api/deleteKey', { method: 'GET' })
      .then(() => {
        window.location.reload();
      })
      .catch(error => console.error(error));
  };

  const testKey = () => {
    callAPI(`/api/testKey?apikey=${apikey}`, { method: 'GET' })
      .then(data => {
        console.log(data);
        setMessage(data.message);
      })
      .catch(error => console.error(error));
  };

  const setKey = () => {
    callAPI(`/api/setKey?apikey=${apikey}`, { method: 'GET' })
      .then(data => {
        console.log(data);
        setMessage(data.message);
      })
      .catch(error => console.error(error));
  };

  const handleApikeyChange = event => {
    setApikey(event.target.value);
  };

  const handleSetRates = () => {
    // Send new rates to Flask backend
    callAPI(`/api/setRates?rates=${newRates}`)
      .then(data => {
        console.log(data);
        setMessage(data.message);
      })
      .catch(error => console.error(error));
  };

  const handleNewRate1Change = (event) => {
    const value = event.target.value;
    setNewRates([Number(value), newRates[1]]);
  }

  const handleNewRate2Change = (event) => {
    const value = event.target.value;
    setNewRates([newRates[0], Number(value)]);
  }

  return (
    <div>
      <Navbar LoadSync=""/>
      <div className="keys-container">
        <h1 className="text-blue-900 text-center text-2xl font-bold pb-2">OpenAI API Key Details</h1>
        <div className="key-card">
          {!api &&
            <div>
              <h3> Setup OpenAI API Key</h3>
              <input type="text" className="apikeyinput" name="api" id="api" value={apikey} onChange={handleApikeyChange} />
              <button  className='keys-cards-button' onClick={testKey}>Test API Key</button>
              <button  className='keys-cards-button' onClick={setKey} >Set API Key</button>
              {message&&
                <p>
                    Info : {message}
                </p>
                }
            </div>
          }
          {api &&
            <div>
              <h3>Your API key is set to :  {api} </h3>
              <button className='keys-cards-button' onClick={deleteKey}>Delete API Key</button>

               <div>
                     <h3 className="text-blue-900 text-center text-xl font-bold pb-2">API Rates Limits</h3>
                     <p>
                       Rate for ChatGPT-3.5 API:
                       <input type="number"  className="ratesinput" value={newRates[0]} onChange={handleNewRate1Change} />
                     </p>
                     <p>
                       Rate for Embeddings API :
                       <input type="number"  className="ratesinput"  value={newRates[1]} onChange={handleNewRate2Change} />
                     </p>
                     <button  className='keys-cards-button' onClick={handleSetRates}>Set Rates</button>
                     {message&&
                        <>
                           {message}
                        </>
                     }
                   </div>
                   <div>

                     Know More about the API Usage here:
                     <a className="text-blue-900 font-bold p-2 underline" href="https://platform.openai.com/docs/guides/rate-limits/what-are-the-rate-limits-for-our-api" target="_blank" rel="noreferrer">
                        OpenAI API Guide
                    </a>
                   </div>
            </div>
          }
        </div>
        <div className="">
          <button className="bg-blue-900 text-white font-bold p-2 rounded ml-auto hover:bg-blue-600 shadow-md flex" onClick={() => navigate('/welcome')}>Continue to Ask AI</button>
        </div>
      </div>
    </div>
  );
}
