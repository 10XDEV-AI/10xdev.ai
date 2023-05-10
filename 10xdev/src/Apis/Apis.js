import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Apis.css';
import Navbar from '../Navbar';

export default function Apis() {
  const navigate = useNavigate();
  const [api, setApi] = useState(null);
  const [apikey, setApikey] = useState('');
  const [message,setMessage] = useState('');
  const [newRates, setNewRates] = useState([3, 60]);

useEffect(() => {
  (async function() {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/getKey`);
      const data = await response.json();
      setApi(data);
      console.log(data);
      const response2 = await fetch(`http://127.0.0.1:5000/api/getRates`);
      const data2 = await response2.json();
      console.log(data2);
    } catch (error) {
      console.error(error);
    }
    setMessage('');
  })();
}, [newRates]);


  const deleteKey = () => {
    fetch(`http://127.0.0.1:5000/api/deleteKey`)
      .then(() => {window.location.reload();})
      .catch(error => console.error(error));
  };

  const testKey = () => {
    fetch(`http://127.0.0.1:5000/api/testKey?apikey=${apikey}`, {
      method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
            console.log(data);
            setMessage(data.message);
          })
    .catch(error => console.error(error));
  }


  const setKey = () => {
    fetch(`http://127.0.0.1:5000/api/setKey?apikey=${apikey}`,{
     method:'GET',
     })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setMessage(data.message);
      })
      .then(() => {window.location.reload();})
      .catch(error => console.error(error));
  };

  const handleApikeyChange = event => {
    setApikey(event.target.value);
  }

const handleSetRates = () => {
    // Send new rates to Flask backend
    fetch(`http://127.0.0.1:5000/api/setRates?rates=${newRates}`)
      .then(response => response.json())
      .then(data => {
                    console.log(data);
                    setMessage(data.message);
                  });
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
        <h1 className="keys-title">OpenAI API Key Details</h1>
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
                     <h3>Current API Rates  Limits</h3>
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
            </div>
          }
        </div>
        <div className="repos-button-container">
          <button className="repos-button" onClick={() => navigate('/')}>Ask AI</button>
        </div>
      </div>
    </div>
  );
}
