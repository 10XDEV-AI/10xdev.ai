import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import SearchContext from '../context/SearchContext';
import { callAPI } from '../api';

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

  const handleSelect = async (branch) => {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md  w-full bg-white border-dashed border-gray-300 border-2 rounded-lg p-6">
          {branches.length > 0 ? (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Select Branch</h2>
              <ul className="mt-4">
                {branches.map((branch) => (
                  <li key={branch}>
                    <button
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded mt-2 focus:outline-none focus:ring"
                      onClick={() => handleSelect(branch)}
                    >
                      {branch}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Branch;
