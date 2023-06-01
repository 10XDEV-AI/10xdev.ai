import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import SearchContext from './context/SearchContext';
import './Welcome.css';
import { callAPI } from './api';
import Cookies from 'js-cookie';
import ProjectInfo from './ProjectInfo/ProjectInfo';
import DropDownButton from './DropDownButton/DropDownButton';

export const Welcome = () => {

  const { setSearchTerm } = useContext(SearchContext);
  const [input, setInput] = useState('');
  const navigate = useNavigate();   //for redirecting to search page

    useEffect(() => {
      const fetchData = async () => {
        // Extract the code from the URL
        const urlParams = new URLSearchParams(window.location.hash.substring(1));
        const code = urlParams.get('access_token');

        if (code) {
          // Store the code in an HTTP-only cookie
          Cookies.set('cognitoCode', code, { path: '/', secure: true, sameSite: 'strict' });

          try {
            // Make an API call to the backend
              await callAPI(`/api/login`, {
              method: 'GET',
            });

            // Remove the code from the URL
            window.history.replaceState({}, document.title, window.location.pathname);
            window.location.reload();

          } catch (error) {
            // Handle the error
          }
        }
      };

      fetchData();
    }, [navigate]);




  const search = (e) =>{
      e.preventDefault();
      setSearchTerm(input);
      navigate('/chat'); // add this line to redirect to /chat
  }

  return (
    <div className='container'>
      <div className="logoContainer">
        10XDEV.AI
      </div>
      <div className="bottomText">
          🦾Train AI on code  ❓ Explain Code  ⚠️ Fix Bugs   🔬 Create Testcases   📖  Write Documentation  🕹️Generate commands ＆ More 🪄
      </div>
      <div className = 'welcomesearchrow'>
          <div className = "searchbarcol">
              <input
                type="text"
                className="mainsearchinput"
                placeholder="   Type an issue, task, or a query"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && search(e)}
                value={input}
              />
          </div>
          <div className = "gobuttoncol">
            <button className="GoButton" onClick={search}>
                🔍
            </button>
          </div>
      </div>
      <div className="projectinfo">
        <ProjectInfo />
      </div>
      <div className="userProfileContainer">
        <DropDownButton/>
      </div>

    </div>
  );
}

export default Welcome;
