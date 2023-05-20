import React, { useEffect, useState, useCallback ,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import SearchContext from './context/SearchContext';
import './Repos.css';
import Navbar from './Navbar';

export default function Repos() {
  const {setPath} = useContext(SearchContext);
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    fetch(`/api/Repos`)
      .then(response => response.json())
      .then(data => setRepos(data))
      .then(() => console.log(repos))
      .catch(error => console.error(error));
  }, []);

  const handleDelete = useCallback((Full_Path) => {
    fetch(`/api/Repos/${Full_Path}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .then(() => {window.location.reload();})
      .catch(error => console.error(error));
  }, []);

  const handleSelect = useCallback((Full_Path) => {
    fetch(`/api/SelectRepo?Full_Path=${Full_Path}`, {
      method: 'GET',
    })
      .then(navigate('/welcome'))
      .catch(error => console.error(error));

    }, [navigate]);

    const handleTrain = useCallback(async (Full_Path) => {
        setPath(Full_Path);
        navigate('/train');
    }, [navigate]);

  const handleChangeBranch = useCallback(async(Full_Path) => {
    setPath(Full_Path);
    navigate('/branch');
    }, [navigate]);

    const handleSync = useCallback(async (Full_Path) => {
        setPath(Full_Path);
    }, [navigate]);

  return (
    <div>
      <Navbar LoadProjectInfo = "True"/>
      <div className="repos-container">
        <h1 className="repos-title">Repositories Trained</h1>
        <div className="repos-cards">
          {repos.map(repo => (
            <div className="repo-card" key={repo.Directory}>
              <div className="repo-card-info">
                <h2>{repo.Directory}</h2>
                <p>
                <button  className="change-branch-button" onClick={() => handleChangeBranch(repo.Full_Path)}> Branch:  {repo.Branch} 🖋️</button>
                </p>
                <p>Trained: {repo.Trained? "Yes" : "No"}</p>
              </div>
              <div className="repo-card-buttons">
                {repo.Trained !== true ? (
                  <button className="repo-card-button" onClick={() => handleTrain(repo.Full_Path)}>Train 🧠</button>
                ) : (
                  <>
                    {repo.Selected ? (
                    <>
                      <button className="repo-card-button" onClick={() => handleSelect(repo.Full_Path)}>Selected ✅</button>
                    </>
                    ) : (
                      <button className="repo-card-button" onClick={() => handleSelect(repo.Full_Path)}>Select ✋️</button>
                    )}
                  </>
                )}
                <button className="repo-card-button" onClick={() => handleDelete(repo.Directory)}>Delete 🗑️</button>
              </div>

            </div>
          ))}
        </div>
        <div className="repos-button-container">
          <button className="repos-button" onClick={() => navigate('/')}>Ask AI</button>
        </div>
      </div>
    </div>
  );
}
