import './SearchBar.css';

function SearchBar() {
    return (
        <div className="searchbarcontainer">
            <input className='searchinput' type="text" placeholder="  What feature would you like to implement?" />
            <button className="GoButton">Go!</button>
        </div>
    );
}

export default SearchBar;