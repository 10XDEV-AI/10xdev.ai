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
        placeholder="   Type an issue, task, or a query. 10xDEV is here to help :)"
        value={searchInput}
        onChange={e => setSearchInput(e.target.value)}
      />
      <button className="GoButton" onClick={handleClick}>Go!</button>
    </div>
  )
}

export default SearchBar;