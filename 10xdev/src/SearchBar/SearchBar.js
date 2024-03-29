import React, { useState , useContext} from 'react';
import SearchContext from "../context/SearchContext";

const SearchBar = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState('');
  const {sideContainerOpen, setSideContainerOpen}  = useContext(SearchContext);

  const handleClick = () => {
    onSearch(searchInput);
    setSearchInput('');
    setSideContainerOpen(false)
  };

  const newTab = async () => {
    const currentUrl = window.location.href;
    const newUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'))+'/welcome';
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
        <span role="img" aria-label="Description of the emoji" className="text-blue-900">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
        </span>
        </button>
      </div>
      <div className="w-180">
        <button
          className="bg-transparent text-blue-900 hover:bg-blue-900 hover:text-white rounded-md text-base w-full py-2 px-4"
          onClick={newTab}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
