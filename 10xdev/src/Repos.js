import React, { useEffect, useState, useCallback ,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import SearchContext from './context/SearchContext';
import './Repos.css';
import Navbar from './Navbar';
import { callAPI } from './api';

export default function Repos() {
  const {setPath} = useContext(SearchContext);
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
  }, [navigate,setPath]);

  const handleChangeBranch = useCallback(async(Directory) => {
    setPath(Directory);
    navigate('/branch');
  }, [navigate,setPath]);

  return (
    <div>
      <Navbar  LoadSync="True"  LoadProjectInfo = "True"/>
      <div className="repos-container">
        <h1 className="repos-title">Repositories Trained</h1>
        <div className="repos-cards">
          {repos.map(repo => (
            <div className="repo-card" key={repo.Directory}>
              <div className="repo-card-info">
                <h2>{repo.Directory}</h2>
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
              </div>

            </div>
          ))}
        </div>
        <div className="repos-button-container">
          <button className="repos-button" onClick={() => navigate('/clone')}>Setup a Repo</button>
        </div>
      </div>
    </div>
  );
}
