
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
  const { isLoading, setIsLoading, path, filesToIgnore, setFilesToIgnore, setShowCheckboxes } = useContext(SearchContext);
  const [input, setInput] = useState(path);
  const [filesToAnalyze, setFilesToAnalyze] = useState([]);
  const [showFilesToIgnore, setShowFilesToIgnore] = useState(false);
  const [showFilesToAnalyze, setShowFilesToAnalyze] = useState(false);
  const [Treedata, setTreedata] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const [isLoadingTree, setIsLoadingTree] = useState(true);
  const [showAddButton, setShowAddButton] = useState([]);

  const handleInputChange = (event) => {
    setInput(event.target.value);
    setShowFilesToIgnore(false);
    setShowFilesToAnalyze(false);
  };

  const convertToTree = (files) => {
    const root = { name: "", children: [] };
    const nodeMap = { root };
    const pathRegex = /[\\/]/; // Matches either forward slash or backslash
    console.log(files);
  
    files.forEach((fileData) => {
      const pathComponents = fileData.Path.split(pathRegex);
      let parent = root;
      for (let i = 0; i < pathComponents.length; i++) {
        const nodeName = pathComponents[i];
        if (!nodeMap[nodeName]) {
          const newNode = { name: nodeName, children: [], code: fileData.code, extension: fileData.Extension };
          nodeMap[nodeName] = newNode;
          parent.children.push(newNode);
        }
        parent = nodeMap[nodeName];
      }
      parent.code = fileData.Code; // Assigning file code to the node
      parent.extension = fileData.Extension; // Assigning file extension to the node
    });
    return root;
  };
  

  const handleSync = async () => {
    navigate('/welcome');
  };

  const handleGetGitIgnore = async () => {
    try {
      setIsLoading(true);
      handleSaveFilesToIgnore();
      setIsLoading(true);
      const data = await callAPI(`/api/Ignore?path=${input}`);
      console.log("Analyse Data");
      setFilesToAnalyze(data.files2analyze);
      setShowFilesToIgnore(true);
      
      const tree = convertToTree(data.files2analyze);
      console.log(tree);
      setTreedata(tree);
      setShowFilesToAnalyze(true);
      setIsLoading(false);
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
    setShowCheckboxes(false);
    setIsLoadingTree(true);
    getTreedata();
  }, []);

  const handleShowPopup = () => {
    if (filesToAnalyze.length > 200) {
      setShowPopup(false);
      alert("Add files to be ignored in the files to ignore box to proceed");
    } else {
      setShowPopup(true);
    }
  };

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
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRowMouseEnter = (index) => {
      setShowAddButton((prevShowAddButton) => {
        const newShowAddButton = [...prevShowAddButton];
        newShowAddButton[index] = true;
        return newShowAddButton;
      });
    };

    const handleRowMouseLeave = (index) => {
      setShowAddButton((prevShowAddButton) => {
        const newShowAddButton = [...prevShowAddButton];
        newShowAddButton[index] = false;
        return newShowAddButton;
      });
    };

  const handleAddToIgnore = async (filePath) => {
    try {
      const updatedFilesToIgnore = [...filesToIgnore, filePath];
      setFilesToIgnore(updatedFilesToIgnore);
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
            {filesToAnalyze.length > 300 ? (
              <>
                <p>Add files to be ignored in the files to ignore box to proceed</p>
                <button
                                  onClick={() => {
                                    setShowPopup(false);
                                  }}
                                  className="border-2 border-blue-900 text-blue-900 rounded-md p-2 mt-4 hover:bg-red-700 hover:border-red-700 hover:text-white"
                                  disabled={filesToAnalyze.length === 0}
                                >
                                  Retry
                                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setShowPopup(false);
                  }}
                  className="border-2 border-blue-900 text-blue-900 rounded-md p-2 mt-4 hover:bg-red-700 hover:border-red-700 hover:text-white"
                  disabled={filesToAnalyze.length === 0}
                >
                  Retry
                </button>
                <button
                  className="border-2 border-blue-900 bg-blue-900 text-white rounded-md p-2 ml-4 hover:bg-red-700"
                  onClick={handleTrain}
                >
                  Train AI
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {isLoading ? (
        <div  className="h-screen"><LoadingRing RedirectTo="/welcome"/></div>
      ) : (
        <div>
          <Navbar />
          <div className="GetIgnorecontainer">
            <label className="w-1/2 flex border border-gray-300 rounded-md p-2">
              <div className="w-80 flex font-bold">Train AI on Repository: </div>
              <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  className="w-full mx-4 focus:outline-none w-96"
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
          <div className="filesdiff border-t mt-2">
            {showFilesToIgnore && showFilesToAnalyze? (

              <div className="w-full flex justify-center">
                <div className="w-8/12 py-1">
                  <div className=" ">
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg m-2  min-h-[70vh]">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs  text-gray-700 uppercase bg-slate-200">
                                <tr>
                                    <th scope="col" className=" w-[70%]">
                                        <h2 className="text-xl font-bold ml-2">Files to Analyze</h2>
                                    </th>
                                    <th scope="col" className="px-1 py-3 text-center w-[15%]">
                                        Tokens
                                    </th>
                                    <th scope="col" className="px-1 py-3 text-center w-[12%]">
                                        Status
                                    </th>
                                    <th scope="col" className="py-3  w-[3%]">
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                              {filesToAnalyze.map((file, index) => (
                                <tr
                                  className="border-b hover:bg-gray-100 max-w-lg"
                                  key={index}
                                  onMouseEnter={() => handleRowMouseEnter(index)}
                                  onMouseLeave={() => handleRowMouseLeave(index)}
                                >
                                  <td className="px-4 break-words max-w-lg">{file.Path}</td>
                                  <td className="text-center">{file.Tokens}</td>
                                  <td className="h-full">
                                    <div className="mx-12 my-auto">{showIcons(file.Sign)}</div>
                                  </td>
                                  <td className="text-center">
                                    <button
                                    onClick={() => handleAddToIgnore(file.Path)}
                                      className={`text-white rounded-sm mx-1 px-1 ${showAddButton[index] ? 'bg-blue-800' : ''}`}
                                    >
                                      Add
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-center text-base font-bold">
                      <h4 className="p-2 m-2 rounded-md bg-green-300 flex ">
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
                    <form className="w-4/12 mx-4  mt-3 shadow-md sm:rounded-lg">
                       <div className="w-full rounded-lg bg-slate-200  min-h-[65vh]">
                           <div className="flex items-center justify-between p-2">
                               <h2 className="text-gray-700 uppercase text-xl font-bold">Files to Ignore</h2>
                               <button onClick={handleGetGitIgnore} className="rounded cursor-pointer sm:ml-auto inline-flex items-center p-1 text-sm font-small text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                                  Save & Refresh
                               </button>
                           </div>
                           <div className="bg-white">
                               <textarea id="editor" rows="8" className="min-h-[70vh] w-full px-2 text-sm bg-white border-0 focus:ring-0"
                               placeholder={"Type files and folders you want the AI to ignore here like this : \n\nsrc/build/ \nnode_modules/ \n.env \n*.zip"}
                                                                             value={filesToIgnore.join('\n')}
                                                                             onChange={(event) =>
                                                                               setFilesToIgnore(event.target.value.split('\n'))
                                                                             }>

                               </textarea>
                           </div>
                       </div>
                    </form>
              </div>
            ) : (
              <div className="ignorecontainer min-h-[65vh]">
                <div className="ignorebox1">
                  <div className="">
                    <h2 className="text-xl font-bold mb-2">All Files</h2>
                    {isLoadingTree ? (
                      <div className="flex justify-center items-center h-[50vh] text-gray-500">
                       Loading......
                      </div>
                    ) : (
                    <div className="min-h-[75vh] border-0 rounded-md bg-white">
                      <FilesTree data={Treedata} CountFiles={true}/>
                    </div>
                    )}
                  </div>
                </div>

                <div className="ignorebox2">
                  <div className="">
                    <div className="">
                      <div className="flex items-center">
                        <h2 className="text-xl font-bold">Files to Ignore:</h2>
                      </div>
                    </div>
                    {
                      <textarea
                        className="w-full min-h-[75vh] p-2 rounded-md text-black h-fit overflow-y-scroll"
                        placeholder={"Type files and folders you want the AI to ignore here like this : \n\nsrc/build/ \nnode_modules/ \n.env \n*.zip"}
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