import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) =>{
  const [searchInput, setSearchInput] = useState('');

  const handleClick = () => {
    onSearch(searchInput);
  }

  return (
    <div className="searchbarcontainer">
       <input
          className="searchinput"
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyPress={e => {
          if (e.keyCode == '13' || e.which == '13') {
            handleClick();
          }}}
        />
      <button className="GoButtonChat" onClick={handleClick}>🔍</button>
    </div>
  )
}

export default SearchBar;