import './Welcome.css';
import SearchBar0 from './SearchBar0/SearchBar0';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';



function Welcome() {
    const navigate = useNavigate();
    const handleSearch = (searchInput) => {
        navigate('/chat', { state:
        { searchInput }
        });
  }
 return (
    <div className="container">
      <div className="container">
        <div className="logoContainer">
            10XDEV.AI
        </div>
        <div className="subText">
            Ask an AI to implement new features in your app!
        </div>
        <div className="welcomesearchrow">
          <SearchBar0 onSearch={handleSearch} />
        </div>
        <div className="bottomText">
            How-To  |  Quick Tips  |  About Us  |  Setup New Repo
        </div>
      </div>
    </div>
  );
}

export default Welcome;