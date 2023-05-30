import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import SearchContext from '../context/SearchContext';
import { callAPI } from '../api';
import './Branch.css';

const Branch = () => {
  const { path, isLoading, setIsLoading } = useContext(SearchContext);
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await callAPI(`/api/branches?path=${path}`);
        setBranches(data);
      } catch (error) {
        console.error('Error fetching branches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [path, setIsLoading]);

  const handleselect = async (branch) => {
    try {
      console.log(branch);
      const data = await callAPI(`/api/setBranch?path=${path}&branch=${branch}`);
      console.log(data);
      navigate(`/repos`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="branch-container">
        {branches.length > 0 ? (
          <div className="ignoretips">
            <h2>Select Branch</h2>
            <ul className="branch-list">
              {branches.map((branch) => (
                <li key={branch}>
                  <button className="branch-buttons" onClick={() => handleselect(branch)}>
                    {branch}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Branch;
