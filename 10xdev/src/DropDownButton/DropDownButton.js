import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DropDownButton.css';

function DropdownButton() {
  const [isOpen, setIsOpen] = useState(false); // state to keep track of whether dropdown is open

  const navigate = useNavigate(); // move the useNavigate hook outside of the handleOptionClick function

  const newTab = async () => {
    const currentUrl = window.location.href;
    // remove the last part of the url
    const newUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
    // open a new tab with the new url
    window.open(newUrl, '_blank');
  };

  const handleOptionClick = (option) => {
    if (option === 1) {
      navigate('/clone');
    }
    if (option === 2) {
      navigate('/train'); // call the useNavigate hook directly inside the function
    }
    if (option === 3) {
      navigate('/repos');
    }
    if (option === 4) {
        newTab();
    }
    if (option === 5) {
        navigate('/apis');
    }
    if (option === 6) {
        navigate('/logs');
    }
    setIsOpen(false); // close the dropdown after an option is selected
  };

  return (
    <div className="dropdown" onMouseLeave={() => setIsOpen(false)}>
      <button className="userProfileButton" onMouseEnter={() => setIsOpen(true)}>⚙️</button>
      {isOpen && (
        <ul className="drop-down-list">
          <li className="drop-down-bullets" onClick={() => handleOptionClick(1)}> ⬇️   Clone Git Repository</li>
          <li className="drop-down-bullets" onClick={() => handleOptionClick(2)}> 🧠   Train Repository</li>
          <li className="drop-down-bullets" onClick={() => handleOptionClick(3)}> 🧳   Your Repositories</li>
          <li className="drop-down-bullets" onClick={() => handleOptionClick(4)}> 🏠   New Topic</li>
          <li className="drop-down-bullets" onClick={() => handleOptionClick(5)}> 🔑   API Keys</li>
          <li className="drop-down-bullets" onClick={() => handleOptionClick(6)}> 🪵 Training Logs</li>
        </ul>
      )}
    </div>
  );
}

export default DropdownButton;
