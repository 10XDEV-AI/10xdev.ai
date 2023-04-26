import React, { useState, useEffect,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Train.css';
import Navbar from './Navbar';
import CheckAIIgnore from './CheckAIIgnore/CheckAIIgnore';
import SearchContext from "./context/SearchContext";
import LoadingRing from "./Loader/Loader";

const Train = () => {
  const {isLoading,setIsLoading}  = useContext(SearchContext);
  const [input, setInput] = useState('');
  const [filesToAnalyze, setFilesToAnalyze] = useState('');
  const [filesToIgnore, setFilesToIgnore] = useState('');
  const [showTrainButton, setShowTrainButton] = useState(false);
  const [showFilesToIgnore, setShowFilesToIgnore] = useState(false);
  const [showFilesToAnalyze, setShowFilesToAnalyze] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const searches = JSON.parse(localStorage.getItem('recentSearches'));
    if (searches) {
      setRecentSearches(searches);
    }
  }, []);

  const handleInputChange = (event) => {
    setInput(event.target.value);
    setShowTrainButton(false);
    setShowFilesToIgnore(false);
    setShowFilesToAnalyze(false);
  };

  const handleGetGitIgnore = () => {
    fetch(`http://127.0.0.1:5000/api/Ignore?path=${input}`)
      .then((response) => response.json())
      .then((data) => {
        setFilesToAnalyze(
          JSON.stringify(data.files2analyze, null, 2)
        );
        setFilesToIgnore(
          JSON.stringify(data.files2ignore, null, 2)
        );
        setShowTrainButton(true);
        setShowFilesToIgnore(true);
        setShowFilesToAnalyze(true);
        // Add the current search to recent searches
        setRecentSearches((prevSearches) => {
          const newSearches = [input, ...prevSearches.filter((s) => s !== input)];
          localStorage.setItem('recentSearches', JSON.stringify(newSearches));
          return newSearches;
        });
      });
  };

  const navigate = useNavigate();
  const handleTrain = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/train?path=${input}`);
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
      navigate('/repos');
  };


  return (
  <div>
    <Navbar />
    {isLoading? (
        <LoadingRing />
         ):(
    <div>
        <div className="GetIgnorecontainer">
          <label className="pathsearchrow">
            <div className="pathsearchlabel">
                Train AI on Path:
            </div>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              className="pathsearchbar"
            />
          </label>
          <div className="gitIgnorebuttoncontainer">
            <button onClick={handleGetGitIgnore} className="gitIgnorebutton">
              Get .AIIgnore
            </button>
            {showTrainButton && (
              <button onClick={handleTrain} className="gitIgnorebutton">
                Start Training
              </button>
            )}
          </div>
        </div>
        <div className="IgnoreCheckcontainer">
           {input && < CheckAIIgnore path={input} />}
           {(
           <div>
             <ul  className="recent-searches">
               {recentSearches.map((search) => (
                 <li className="recent-search-bullets">
                   <button className="recent-search-button" onClick={() => setInput(search)}>{search}</button>
                 </li>
               ))}
             </ul>
           </div>
           )}
        </div>
        <div className="filesdiff">
              {
              (showFilesToIgnore && showFilesToAnalyze) ? (
                    <div className="ignorecontainer">
                      <div className="ignorebox">
                        <div className="ignoretext">
                          <h2>Files to Analyze:</h2>
                          <pre>{filesToAnalyze}</pre>
                        </div>
                      </div>
                      <div className="ignorebox">
                        <div className="ignoretext">
                          <h2>Files to Ignore:</h2>
                          <pre>{filesToIgnore}</pre>
                        </div>
                      </div>
                    </div>
                    ):
                    (
                        <div className="ignorecontainer">
                            <div className="ignoretips">
                            <h2> 💡Tips on '.AIIgnore' File:</h2>
                            <ul>
                                <li> Add folders like node_modules, .git, .vscode, etc. to .AIIgnore file </li>
                                <li> Add files like .DS_Store, .gitignore, etc. to .AIIgnore file </li>
                                <li> Add any other files that are not required for training </li>
                                <li> Break down big files to smaller files </li>
                                <li> Works well with small files </li>
                                <li> Works well for files with comments </li>
                            </ul>
                            </div>
                        </div>
                    )
              }
        </div>
    </div>
    )}
  </div>
    );
};

export default Train;
