import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) =>{
  const [searchInput, setSearchInput] = useState('');

  const handleClick = () => {
    onSearch(searchInput);
  }

  const newTab = async () => {
      const currentUrl = window.location.href;
      // remove the last part of the url
      const newUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
      // open a new tab with the new url
      window.open(newUrl, '_blank');
    };

  return (
  <div className="bottombar">
    <div className="chatsearchbarcontainer">
       <input
          className="searchinput"
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        />
      <button className="GoButtonChat" onClick={handleClick}>🔍</button>

    </div>
    <button className="NewChatButton" onClick={newTab}>Start New Topic</button>

  </div>
  )
}

export default SearchBar;