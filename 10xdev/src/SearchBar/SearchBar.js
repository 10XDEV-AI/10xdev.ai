import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleClick = () => {
    onSearch(searchInput);
  };

  const newTab = async () => {
    const currentUrl = window.location.href;
    const newUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
    window.open(newUrl, '_blank');
  };

  return (
    <div className="flex w-full">
      <div className="flex items-center pl-7 pr-2 rounded-md bg-white flex-1 ml-[25%] mr-[10%]">
        <input
          className="flex-1 text-base bg-white rounded-md border-none outline-none mr-2"
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        />
        <button className="text-2xl bg-white" onClick={handleClick}>
        <span role="img" aria-label="Description of the emoji"> 🔍</span> 
        </button>
      </div>
      <div className="w-180">
        <button
          className="border border-blue-500 bg-transparent text-blue-500 hover:bg-blue-500 hover:text-white rounded-md text-base w-full py-2 px-4"
          onClick={newTab}
        >
          Start New Topic
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
