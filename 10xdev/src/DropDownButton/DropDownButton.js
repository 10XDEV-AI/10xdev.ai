import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DropDownButton.css';

function DropdownButton() {
  const [isOpen, setIsOpen] = useState(false); // state to keep track of whether dropdown is open

  const navigate = useNavigate(); // move the useNavigate hook outside of the handleOptionClick function

  const toggleDropdown = () => {
    setIsOpen(!isOpen); // toggle the dropdown state
  };

  const handleOptionClick = (option) => {
    if (option === 1) {
      navigate('/train'); // call the useNavigate hook directly inside the function
    }
    if (option === 2) {
      navigate('/repos');
    }
    if (option === 3) {
         window.open(window.location.href, '_blank');
    }
    setIsOpen(false); // close the dropdown after an option is selected
  };

  return (
    <div className="dropdown">
      <button className="userProfileButton" onClick={toggleDropdown}>⚙️</button>
      {isOpen && (
        <ul className="drop-down-list">
          <li className="drop-down-bullets" onClick={() => handleOptionClick(1)}> 🧠   Train Repository</li>
          <li className="drop-down-bullets" onClick={() => handleOptionClick(2)}> 🧳   Your Repositories</li>
          <li className="drop-down-bullets" onClick={() => handleOptionClick(3)}> 🏠   Ask AI</li>
        </ul>
      )}
    </div>
  );
}

export default DropdownButton;