import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DropDownButton.css';
import {TbApi} from "react-icons/tb";
import {BiGitRepoForked ,BiLogOut} from "react-icons/bi";
import {BsPlusCircleFill} from "react-icons/bs";
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
    if (option === 3) {
        navigate('/');
    }
    if (option === 4) {
        navigate('/apis');
    }
    if (option === 2) {
        navigate('/repos');
    }
    setIsOpen(false); // close the dropdown after an option is selected
  };

  return (
    <div className="dropdown z-50" onMouseLeave={() => setIsOpen(false)}>
      <button className="userProfileButton" onMouseEnter={() => setIsOpen(true)}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-inherit">
          <path fillRule="evenodd" d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-3.873 8.703a4.126 4.126 0 017.746 0 .75.75 0 01-.351.92 7.47 7.47 0 01-3.522.877 7.47 7.47 0 01-3.522-.877.75.75 0 01-.351-.92zM15 8.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15zM14.25 12a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H15a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15z" clipRule="evenodd" />
      </svg>
      </button>
      {isOpen && (
        <ul className="drop-down-list rounded-md text-black">
          <li className="drop-down-bullets hover:bg-blue-900 text-blue-900 hover:text-white  rounded-md flex" onClick={() => handleOptionClick(1)}> <BsPlusCircleFill className=' text-xl mx-2 '/>Setup New Repo</li>
          <li className="drop-down-bullets hover:bg-blue-900 text-blue-900 hover:text-white rounded-md flex" onClick={() => handleOptionClick(2)}> <BiGitRepoForked className=' text-xl mx-2 '/>Your Repositories</li>
          <li className="drop-down-bullets hover:bg-blue-900 text-blue-900 hover:text-white rounded-md flex" onClick={() => handleOptionClick(4)}> <TbApi className=" text-xl mx-2 " />API Keys</li>
          <li className="drop-down-bullets hover:bg-blue-900 text-blue-900 hover:text-white rounded-md flex" onClick={() => handleOptionClick(3)}> <BiLogOut className=' text-xl mx-2 ' /> Log Out</li>
        </ul>
      )}
    </div>
  );
}

export default DropdownButton;
