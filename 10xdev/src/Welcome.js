import React, { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import SearchContext from './context/SearchContext';
import './Welcome.css';
import ProjectInfo from './ProjectInfo/ProjectInfo';
import DropDownButton from './DropDownButton/DropDownButton';

export const Welcome = () => {

  const { setSearchTerm,userPic } = useContext(SearchContext);
  const [input, setInput] = useState('');
  const navigate = useNavigate();   //for redirecting to search page

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
      <div className="subText">
          Ask an AI to implement new features in your app!
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
