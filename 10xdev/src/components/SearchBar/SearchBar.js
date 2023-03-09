import './SearchBar.css';
import React, { useState } from 'react';

const SearchBar = () =>{
    const [searchInput, setSearchInput] = useState('');
    const handleClick = () => {
        const url = `http://127.0.0.1:5000/api/data?city=${searchInput}`;
        fetch(url)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error));
     }
    return (
        <div className="searchbarcontainer">
            <input className="searchinput" type="text" placeholder="   Type an issue, task, or a query. 10xDEV is here to help :)" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
            <button className="GoButton" onClick={handleClick}>Go!</button>
        </div>
    )
}

export default SearchBar;