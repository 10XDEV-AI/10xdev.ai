import React, { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import SearchContext from './context/SearchContext';
import './Welcome.css';
import ProjectInfo from './ProjectInfo/ProjectInfo';

export const Welcome = () => {

  const { searchTerm, setSearchTerm, setIsLoading } = useContext(SearchContext);
  const [input, setInput] = useState('');
  const navigate = useNavigate();   //for redirecting to search page

  const search = (e) =>{
      e.preventDefault();
      setSearchTerm(input);
      navigate('/chat'); // add this line to redirect to /chat
      //setIsLoading(true);
  }

  return (
    <div>
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
                  className="searchinput"
                  placeholder="   Type an issue, task, or a query. 10xDEV is here to help :)"
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
              />
          </div>
          <div className = "gobuttoncol">
            <button className="GoButton" onClick={search}>Go</button>
          </div>
      </div>
      <div className="projectinfo">
        <ProjectInfo />
      </div>
    </div>
  );
}

export default Welcome;
