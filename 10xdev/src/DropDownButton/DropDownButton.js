import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchContext from '../context/SearchContext';
import './DropDownButton.css';

function DropdownButton() {
  const [isOpen, setIsOpen] = useState(false); // state to keep track of whether dropdown is open
  const {userPic} = useContext(SearchContext);
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
    setIsOpen(false); // close the dropdown after an option is selected
  };

  return (
    <div className="dropdown">
      <button className="userProfileButton" onClick={toggleDropdown}>⚙️</button>
      {isOpen && (
        <ul>
          <li onClick={() => handleOptionClick(1)}>Train Repository</li>
          <li onClick={() => handleOptionClick(2)}>Your Repositories</li>
        </ul>
      )}
    </div>
  );
}

export default DropdownButton;