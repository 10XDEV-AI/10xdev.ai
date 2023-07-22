
import React, { useState, useContext } from 'react';
import './Train.css';
import Navbar from './Navbar';
import SearchContext from "./context/SearchContext";
import LoadingRing from "./Loader/Loader";
import { callAPI } from './api';
import { useEffect } from "react";
import FilesTree from "./FileTree";
import Sync from './Sync/Sync';
import {useNavigate} from 'react-router-dom';
import {RiFileWarningFill} from 'react-icons/ri';
import {BsFillFileEarmarkCheckFill } from 'react-icons/bs';
import {AiFillFileUnknown} from 'react-icons/ai';

const Train = () => {
  const { isLoading, setIsLoading, path } = useContext(SearchContext);
  const [input, setInput] = useState(path);
  const [filesToAnalyze, setFilesToAnalyze] = useState([]);
  const [filesToIgnore, setFilesToIgnore] = useState([]);
  const [showFilesToIgnore, setShowFilesToIgnore] = useState(false);
  const [showFilesToAnalyze, setShowFilesToAnalyze] = useState(false);
  const [Treedata, setTreedata] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const [isLoadingTree, setIsLoadingTree] = useState(true);

  const handleInputChange = (event) => {
    setInput(event.target.value);
    setShowFilesToIgnore(false);
    setShowFilesToAnalyze(false);
  };

  const convertToTree = (files) => {
    const root = { name: "", children: [] };
    const nodeMap = { root };
    const pathRegex = /[\\/]/; // Matches either forward slash or backslash

    files.forEach((file) => {
      const pathComponents = file.Path.split(pathRegex);
      let parent = root;
      for (let i = 0; i < pathComponents.length; i++) {
        const nodeName = pathComponents[i];
        if (!nodeMap[nodeName]) {
          const newNode = { name: nodeName, children: [] };
          nodeMap[nodeName] = newNode;
          parent.children.push(newNode);
        }
        parent = nodeMap[nodeName];
      }
    });

    return root;
  };

  const handleSync = async () => {
    navigate('/welcome');
  };

  const handleGetGitIgnore = async () => {
    try {
      setIsLoading(true);
      const data = await callAPI(`/api/Ignore?path=${input}`);
      console.log("Analyse Data");
      console.log(data);
      setFilesToAnalyze(data.files2analyze);
      setFilesToIgnore(data.files2ignore);
      setShowFilesToIgnore(true);
      const tree = convertToTree(data.files2analyze);
      setTreedata(tree);
      setShowFilesToAnalyze(true);
      setIsLoading(false);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const showIcons = (sign) => {
    if (sign === "warning") {
      return <RiFileWarningFill className="text-yellow-500 text-xl" />;
    } else if (sign === "success") {
      return <BsFillFileEarmarkCheckFill className="text-green-500 text-xl" />;
    } else if (sign === "info") {
      return <AiFillFileUnknown className="text-blue-500 text-xl" />;
    }
  };

  const getTreedata = async () => {
    try {
      const data = await callAPI(`/api/Treedata?path=${input}`);
      const tree = convertToTree(data.files2analyze);
      setFilesToIgnore(data.files2ignore);
      setTreedata(tree);
      setIsLoadingTree(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsLoadingTree(true);
    getTreedata();
  }, []);

  const handleShowPopup = () => {
  console.log(filesToAnalyze);
  setShowPopup(true);
  }
  const handleTrain = async () => {
    setIsLoading(true);
    try {
      const data = await callAPI(`/api/train?path=${input}`);
      // Make API call using callAPI
      console.log(data);
    } catch (error) {
      console.error(error);
    }
    setShowPopup(false);
  };

  const handleSaveFilesToIgnore = async () => {
    setIsLoading(true);
    console.log(filesToIgnore);
    try {
      const data = await callAPI('/api/saveFilesToIgnore', {
        method: 'POST',
        body: JSON.stringify({ path: input, filesToIgnore: filesToIgnore }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(data);
      handleGetGitIgnore();
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-500 backdrop-filter backdrop-blur-sm">
            <div className="bg-gray-100 p-4 rounded-md text-center">
              <p>You will be training {filesToAnalyze.length} files</p>
              <button
                onClick={handleTrain}
                className="bg-blue-900 text-white rounded-md p-2 mt-4 hover:bg-red-700"
                disabled={filesToAnalyze.length === 0}
              >
                Train AI
              </button>
              <button
                onClick= {() => {setShowPopup(false)}}
                className="bg-blue-900 text-white rounded-md p-2 ml-4 hover:bg-red-700"
              >
                Retry
                </button>

            </div>
          </div>
        )}

      {isLoading ? (
        <LoadingRing RedirectTo="/repos" className="h-screen w-screen"/>
      ) : (
        <div>
          <Navbar />
          <div className="GetIgnorecontainer">
            <label className="pathsearchrow">
              <div className="pathsearchlabel">Train AI on Path: </div>
              <input
  type="text"
  value={input}
  onChange={handleInputChange}
  className="w-full peer px-4 py-2  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
/>

            </label>
            <div className="gitIgnorebuttoncontainer">
              <div>
                <button
                  onClick={handleGetGitIgnore}
                  className="bg-blue-900 text-white p-2 ml-2 rounded hover:bg-blue-700"
                >
                  Analyze Files
                </button>
                {showFilesToIgnore && (
                <>
                  <button
                    onClick={handleShowPopup}
                    className="bg-blue-900 text-white p-2 m-2 rounded hover:bg-blue-700"
                    >
                    Start Training
                  </button>
                  <button
                    onClick={handleSync}
                    className="bg-blue-900 text-white p-2 rounded hover:bg-blue-700"
                    >
                    Sync Changes
                  </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="filesdiff">
            {showFilesToIgnore && showFilesToAnalyze ? (
              <div className="w-full flex justify-center">
                <div className="ignorebox1 ">
                  <div className="ignoretext ">
                    <h2 className="text-xl font-bold">Files to Ignore:</h2>
                    <table className="ignoretable bg-white rounded-lg shadow-md">
                      <thead className="h-3">
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
                            <td>{file.Tokens}</td>
                            <td>{showIcons(file.Sign) }</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex justify-center text-base font-bold">
                      <h4 className="p-2 m-2 rounded-md bg-green-300 flex">
                        <span role="img" aria-label="Description of the emoji">
                          <BsFillFileEarmarkCheckFill color="green"  className='text-xl' />
                        </span>
                        : All good
                      </h4>
                      <h4 className="p-2 m-2 rounded-md bg-yellow-200 flex">
                        <span role="img" aria-label="emoji">
                        <RiFileWarningFill color="" className='text-yellow-500  text-xl'  />
                        </span>
                        : File too long
                      </h4>
                      <h4 className="p-2 m-2 rounded-md bg-blue-300 flex">
                        <span role="img" aria-label="emoji">
                          <AiFillFileUnknown color="blue"  className='text-xl' />
                        </span>
                        : File is not text
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="ignorebox2">
                      <div className="flex mb-1">
                        <h2 className="text-xl font-bold">Files to Ignore:</h2>
                        <div className="ml-auto bg-blue-900 text-white px-2 mx-2 pt-1 rounded-md hover:bg-blue-700">
                          <button onClick={handleSaveFilesToIgnore} className="">
                            Save & Refresh
                          </button>
                        </div>
                      </div>
                      <div className="h-full">
                        {
                          <textarea
                            className="w-full h-[80%] p-2 rounded-md text-black shadow-md"
                            placeholder="Type files you want the AI to ignore here"
                            value={filesToIgnore.join('\n')}
                            onChange={(event) =>
                              setFilesToIgnore(event.target.value.split('\n'))
                            }
                          />
                        }
                      </div>
                </div>
              </div>
            ) : (
              <div className="ignorecontainer">
                <div className="ignorebox1">
                  <div className="min-h-[60%]">
                    <h2 className="text-xl font-bold">All Files</h2>

                    {isLoadingTree ? (
                      <div className="flex justify-center items-center h-[50vh] text-gray-500">
                       Loading......
                      </div>
                    ) : (
                      <FilesTree data={Treedata} />
                    )}
                  </div>
                </div>
                <div className="ignorebox2">
                  <div className="ignoretext">
                    <div className="">
                      <div className="flex">
                        <h2 className="text-xl font-bold">Files to Ignore:</h2>
                        <div className="ml-auto bg-blue-900 text-white px-2 py-1 mx-2 rounded-md hover:bg-blue-700">
                          <button onClick={handleSaveFilesToIgnore} className="">
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                    {
                      <textarea
                        className="w-full h-[80%] p-2 rounded-md text-black mb-2"
                        placeholder="Type files and folders you want the AI to ignore here."
                        value={filesToIgnore.join('\n')}
                        onChange={(event) =>
                          setFilesToIgnore(event.target.value.split('\n'))
                        }
                      />
                    }
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
  </div>
);
};

export default Train;