import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchContext from './context/SearchContext';
import './Repos.css';
import Navbar from './Navbar';
import { callAPI } from './api';
import LoadingRing from "./Loader/Loader";

export default function Repos() {
  const {isLoading, setIsLoading } = useContext(SearchContext);
  const { setShowRepos } = useContext(SearchContext);
  const { setPath } = useContext(SearchContext);
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    callAPI('/api/Repos')
      .then(data => setRepos(data))
      .catch(error => console.error(error));
  }, []);

  const handleDelete = useCallback(async (Directory) => {
    try {
      const response = await callAPI(`/api/Repos/${Directory}`, {
        method: 'DELETE',
      });
      console.log(response);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleSelect = useCallback(async (Directory) => {
    try {
      await callAPI(`/api/SelectRepo?Directory=${Directory}`, {
        method: 'GET',
      });
      navigate('/welcome');
    } catch (error) {
      console.error(error);
    }
  }, [navigate]);

  const handleTrain = useCallback(async (Directory) => {
    setPath(Directory);
    navigate('/train');
  }, [navigate, setPath]);

  const handleChangeBranch = useCallback(async (Directory) => {
    setPath(Directory);
    navigate('/branch');
  }, [navigate, setPath]);

  const handleFiles = useCallback(async (Directory) => {
    setPath(Directory);
    navigate('/train');
  }, [navigate, setPath]);

  return (
    <div>
      {isLoading ? (<><LoadingRing /> </>) : (
      <div className="repos-container">
      <button className="back-button" onClick={() => setShowRepos(false)}>
        Back
      </button>
        <h1 className="w-full text-center text-3xl font-bold pb-10 text-blue-900">Repositories Trained</h1>
        <div className="repos-cards">
          {repos.map(repo => (
            <div className="repo-card" key={repo.Directory}>
              <div className="repo-card-info">
                <h2 className="font-bold">{repo.Directory}</h2>
                <p>
                <button  className="change-branch-button" onClick={() => handleChangeBranch(repo.Directory)}> Branch:  {repo.Branch} 🖋️</button>
                </p>
                <p>Trained: {repo.Trained? "Yes" : "No"}</p>
              </div>
              <div className="repo-card-buttons">
                {repo.Trained !== true ? (
                  <button className="repo-card-button" onClick={() => handleTrain(repo.Directory)}>Train 🧠</button>
                ) : (
                  <>
                    {repo.Selected ? (
                    <>
                      <button className="repo-card-button" onClick={() => handleSelect(repo.Directory)}>Selected ✅</button>
                    </>
                    ) : (
                      <button className="repo-card-button" onClick={() => handleSelect(repo.Directory)}>Select ✋️</button>
                    )}
                  </>
                )}
                <button className="repo-card-button" onClick={() => handleDelete(repo.Directory)}>Delete 🗑️</button>
                <button className="repo-card-button" onClick={() => handleFiles(repo.Directory)}>Files 📂️</button>
                </div>

            </div>
          ))}
        </div>
        <div className="repos-button-container">
          <button className="bg-blue-900 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md w-full m-20 w-full m-20" onClick={() => navigate('/clone')}>Setup a Repository</button>
        </div>
      </div>)}
    </div>
  );
}
