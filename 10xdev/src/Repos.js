import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Repos.css';
import Navbar from './Navbar';

export default function Repos() {
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/Repos`)
      .then(response => response.json())
      .then(data => setRepos(data))
      .catch(error => console.error(error));
  }, []);

  const handleDelete = useCallback((Full_Path) => {
    fetch(`http://127.0.0.1:5000/api/Repos/${Full_Path}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .then(() => {window.location.reload();})
      .catch(error => console.error(error));
  }, []);

  const handlSelect = useCallback((Full_Path) => {
    fetch(`http://127.0.0.1:5000/api/SelectRepo?Full_Path=${Full_Path}`, {
      method: 'GET',
    })
      .then(() => {navigate('/')})
      .catch(error => console.error(error));

    }, [navigate]);

  return (
    <div>
      <Navbar LoadSync=""/>
      <div className="repos-container">
        <h1 className="repos-title">Repositories Trained</h1>
        <div className="repos-cards">
          {repos.map(repo => (
            <div className="repo-card" key={repo.Directory}>
              <div className="repo-card-info">
                <h2>{repo.Directory}</h2>
                <p>Branch: {repo.Branch}</p>
                <p>AIIgnore: {repo.AIIgnore.toString()}</p>
                <p>Full Path: {repo.Full_Path}</p>
              </div>
              <div className="repo-card-buttons">
                <button className="repo-card-button" onClick={() => handlSelect(repo.Full_Path)}>Select ✋️</button>
                {repo.Directory !== "Test" &&
                <button className="repo-card-button" onClick={() => handleDelete(repo.Directory)}>Delete 🗑️</button>}
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
