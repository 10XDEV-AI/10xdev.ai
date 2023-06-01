import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Clone.css';
import Navbar from './Navbar';
import SearchContext from './context/SearchContext';
import LoadingRing from './Loader/Loader';
import { callAPI } from './api';

const Clone = () => {
  const { isLoading, setIsLoading } = useContext(SearchContext);
  const [branches, setBranches] = useState([]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleClone = async () => {
    setIsLoading(true);
    try {
      const data = await callAPI(`/api/clone?path=${input}`,{
      method: 'GET',
      });
      console.log(data);
      setBranches(data);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleselect = async (branch) => {
    try {
      console.log(branch);
      const data = await callAPI(`/api/setBranch?path=${input}&branch=${branch}`,{
      method: 'GET',
      });
      console.log(data);
      navigate(`/repos`);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div>
      <Navbar />
      {isLoading ? (
        <LoadingRing />
      ) : (
        <div>
          <div className="GetIgnorecontainer">
            <label className="pathsearchrow">
              <div className="pathsearchlabel">Clone Repo :</div>
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                className="pathsearchbar"
              />
            </label>
            <button onClick={handleClone} className="gitIgnorebutton">
              Clone Repository
            </button>
          </div>
          <div className="branch-container">
              {branches.length > 0 ? (
                <div className="ignoretips">
                    <h2> Select your desired branch </h2>
                  {(
                    <ul className="branch-list">
                      {branches.map((branch,) => (
                        <li key = {branch}>
                          <button className="branch-buttons" onClick={() => handleselect(branch)}>{branch}</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) :
              (
              <div className="ignoretips">
              <h2> 💡Tips on training Repository</h2>
                  <ul>
                      <li> Add big folders and packages not in use to .AIIgnore file </li>
                      <li> Add any other files that are not required for training </li>
                      <li> Break down big files to smaller files </li>
                      <li> Works well with small files </li>
                      <li> Works well for files with comments </li>
                  </ul>
              </div>
              )
              }
          </div>
        </div>
      )}
    </div>
  );
};

export default Clone;
