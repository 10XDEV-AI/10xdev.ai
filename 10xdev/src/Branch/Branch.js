import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import SearchContext from '../context/SearchContext';
import { callAPI } from '../api';
import LoadingRing from "../Loader/Loader";
import { FaSync } from 'react-icons/fa';

const Branch = () => {
  const { path, isLoading, setIsLoading } = useContext(SearchContext);
  const [branches, setBranches] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
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
      navigate(`/welcome`);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const data = await callAPI(`/api/branches?path=${path}`);
      setBranches(data);
    } catch (error) {
      console.error('Error refreshing branches:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div>
      <Navbar />
      {(isLoading || isRefreshing)? (
        <LoadingRing className="h-screen"/>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md w-full bg-white border-dashed border-gray-300 border-2 rounded-lg p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">Select Branch</h2>
              <button
                className="text-gray-600 hover:text-gray-800 focus:outline-none"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <FaSync />
              </button>
            </div>
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
        </div>
      )}
    </div>
  );
};

export default Branch;