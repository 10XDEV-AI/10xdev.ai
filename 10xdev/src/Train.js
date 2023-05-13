import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Train.css';
import Navbar from './Navbar';
import CheckAIIgnore from './CheckAIIgnore/CheckAIIgnore';
import SearchContext from "./context/SearchContext";
import LoadingRing from "./Loader/Loader";

const Train = () => {
  const {isLoading,setIsLoading}  = useContext(SearchContext);
  const [input, setInput] = useState('');
  const [filesToAnalyze, setFilesToAnalyze] = useState([]);
  const [filesToIgnore, setFilesToIgnore] = useState([]);
  const [showTrainButton, setShowTrainButton] = useState(false);
  const [showFilesToIgnore, setShowFilesToIgnore] = useState(false);
  const [showFilesToAnalyze, setShowFilesToAnalyze] = useState(false);

  const handleInputChange = (event) => {
    setInput(event.target.value);
    setShowTrainButton(false);
    setShowFilesToIgnore(false);
    setShowFilesToAnalyze(false);
      };

  const handleGetGitIgnore = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`http://127.0.0.1:5000/api/Ignore?path=${input}`);
        const data = await response.json();
        setFilesToAnalyze(data.files2analyze);
        setFilesToIgnore(data.files2ignore);
        setShowTrainButton(true);
        setShowFilesToIgnore(true);
        setShowFilesToAnalyze(true);
        setIsLoading(false)
      } catch (error) {
        console.log(error);
      }
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
    
    {isLoading? (
        <LoadingRing />
         ):(
    <div>
    <Navbar />
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
            {showTrainButton ? (
            <div>
              <button onClick={handleGetGitIgnore} className="gitIgnorebutton">
                Refresh .AIIgnore
              </button>
              <button onClick={handleTrain} className="gitIgnorebutton">
                Start Training
              </button>
            </div>
            )
              : (
              <button onClick={handleGetGitIgnore} className="gitIgnorebutton">
                Get .AIIgnore
              </button>
              )}
          </div>
        </div>
        <div className="IgnoreCheckcontainer">
           {input && < CheckAIIgnore path={input} />}
        </div>
        <div className="filesdiff">
              {
              (showFilesToIgnore && showFilesToAnalyze) ? (
                    <div className="ignorecontainer">
                      <div className="ignorebox">
                        <div className="ignoretext">
                          <h2>Files to Analyze:</h2>
                            <table className = "ignoretable">
                                  <thead>
                                    <tr>
                                      <th>File Path</th>
                                      <th>Tokens</th>
                                      <th>Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filesToAnalyze.map((file, index) => (
                                      <tr key={index}>
                                        <td className="tdp">{file.Path}</td>
                                        <td> {file.Tokens}</td>
                                        <td> {file.Sign}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                        </div>
                      </div>
                      <div className="ignorebox">
                        <div className="ignoretext">
                          <h2>Files to Ignore:</h2>
                          {filesToIgnore.map((file, index) => (
                            <ul key={index}>
                                <li>{file}</li>
                            </ul>
                            ))}
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
