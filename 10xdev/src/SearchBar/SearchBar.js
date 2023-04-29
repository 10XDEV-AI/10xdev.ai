import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) =>{
  const [searchInput, setSearchInput] = useState('');

  const handleClick = () => {
    onSearch(searchInput);
  }

  return (
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
  )
}

export default SearchBar;