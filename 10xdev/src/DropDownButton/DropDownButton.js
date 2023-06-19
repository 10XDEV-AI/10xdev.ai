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
      navigate('/repos');
    }
    if (option === 3) {
        navigate('/');
    }
    if (option === 4) {
        navigate('/apis');
    }
    if (option === 5) {
        navigate('/logs');
    }
    setIsOpen(false); // close the dropdown after an option is selected
  };

  return (
    <div className="dropdown" onMouseLeave={() => setIsOpen(false)}>
      <button className="userProfileButton" onMouseEnter={() => setIsOpen(true)}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 ">
        <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
      </svg>
      </button>
      {isOpen && (
        <ul className="drop-down-list rounded-md">
          <li className="drop-down-bullets hover:bg-blue-900 rounded-md" onClick={() => handleOptionClick(1)}> 🧠 Setup Repository</li>
          <li className="drop-down-bullets hover:bg-blue-900 rounded-md" onClick={() => handleOptionClick(2)}> 🧳 Your Repositories</li>
          <li className="drop-down-bullets hover:bg-blue-900 rounded-md" onClick={() => handleOptionClick(4)}> 🔑 API Keys</li>
          <li className="drop-down-bullets hover:bg-blue-900 rounded-md" onClick={() => handleOptionClick(3)}> 👋🏻 Log Out</li>
        </ul>
      )}
    </div>
  );
}

export default DropdownButton;
