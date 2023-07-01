import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchContext from './context/SearchContext';
import {BiGitBranch} from 'react-icons/bi';
import { FaBrain } from "react-icons/fa";
import './Repos.css';
import Navbar from './Navbar';
import { callAPI } from './api';
import LoadingRing from "./Loader/Loader";
import {MdDelete} from 'react-icons/md';
import {FcOpenedFolder} from 'react-icons/fc';
import {BsFillPatchCheckFill,BsPatchCheck} from 'react-icons/bs';
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
      }
      , []);

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
      window.location.reload();
      setShowRepos(false);
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

  const handleGoBack = useCallback(async () => {
    setShowRepos(false);
    navigate('/welcome');
  }, [navigate, setShowRepos]);

  return (
    <div>
      {isLoading ? (<><LoadingRing /> </>) : (
      <div className="repos-container h-screen">
      <div className = "flex  pb-10 ">
        <button className="bg-blue-900 hover:bg-blue-600 text-white px-4 rounded-md" onClick={()=>handleGoBack()}>
        Back
        </button>
        <h1 className="w-full text-center text-3xl font-bold text-blue-900">Repositories Trained</h1>
        </div>
        <div className="repos-cards">
          {repos.map(repo => (
            <div className="repo-card" key={repo.Directory}>
              <div className="repo-card-info">
                <h2 className="font-bold">{repo.Directory}</h2>
                <p>
                <button  className="change-branch-button px-1 flex" onClick={() => handleChangeBranch(repo.Directory)}> Branch:  {repo.Branch} <BiGitBranch className="text-blue-900 my-1"/> </button>
                </p>
                <p>Trained: {repo.Trained? "Yes" : "No"}</p>
              </div>
              <div className="repo-card-buttons">
                {repo.Trained !== true ? (
                  <button className="repo-card-button px-1" onClick={() => handleTrain(repo.Directory)}> <div className="mb-1.5">Train</div> <FaBrain className="text-pink-500 text-xl " /></button>
                ) : (
                  <>
                    {repo.Selected ? (
                    <>
                      <button className="repo-card-button text-center px-1" onClick={() => handleSelect(repo.Directory)}> Selected <BsFillPatchCheckFill className="text-xl " color="green" style={{
                        marginLeft: "20px",marginTop: "3px"
                      }} /></button>
                    </>
                    ) : (
                      <button className="repo-card-button mx-1" onClick={() => handleSelect(repo.Directory)}>Select <BsPatchCheck className="text-xl " color="green" style={{
                        marginLeft: "10px",marginTop: "3px"
                      }} /> </button>
                    )}
                  </>
                )}
                <button className="repo-card-button px-1" onClick={() => handleDelete(repo.Directory)}>Delete <MdDelete color="#9b9b9b" className="text-2xl" style={{marginTop:"1px"}}  /></button>
                <button className="repo-card-button px-1" onClick={() => handleFiles(repo.Directory)}>Files <FcOpenedFolder className="text-2xl" /></button>
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
