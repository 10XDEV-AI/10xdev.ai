import React, { useState, useContext } from 'react';
import './Train.css';
import Navbar from './Navbar';
import SearchContext from "./context/SearchContext";
import LoadingRing from "./Loader/Loader";
import {callAPI} from './api';
import {useEffect} from "react";
import FilesTree from "./FileTree";
const Train = () => {
  const { isLoading, setIsLoading, path } = useContext(SearchContext);
  const [input, setInput] = useState(path);
  const [filesToAnalyze, setFilesToAnalyze] = useState([]);
  const [filesToIgnore, setFilesToIgnore] = useState([]);
  const [showFilesToIgnore, setShowFilesToIgnore] = useState(false);
  const [showFilesToAnalyze, setShowFilesToAnalyze] = useState(false);
  const [Treedata, setTreedata] = useState([]);
  const handleInputChange = (event) => {
    setInput(event.target.value);
    setShowFilesToIgnore(false);
    setShowFilesToAnalyze(false);
  };
  const convertToTree = (files) => {
    const root = { name: "", children: [] };
    const nodeMap = { root };
    
    files.forEach((file) => {
      const path = file.Path.split("/");
      let parent = root;
      
      for (let i = 0; i < path.length; i++) {
        const nodeName = path[i];
        
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
  
  const handleGetGitIgnore = async () => {
    try {
      setIsLoading(true);
      const data = await callAPI(`/api/Ignore?path=${input}`);
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
  const getTreedata = async () => {
    try {
      const data = await callAPI(`/api/FilesToAnalyzedata?path=${input}`);
      const tree = convertToTree(data.files2analyze);
      setTreedata(tree);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTreedata();
  }, []);


  const handleTrain = async () => {
    setIsLoading(true);
    try {
      const data = await callAPI(`/api/train?path=${input}`); // Make API call using callAPI
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveFilesToIgnore = async () => {
    setIsLoading(true);
    console.log(filesToIgnore);
    try {
      const data = await callAPI('/api/saveFilesToIgnore', {
        method: 'POST',
        body: JSON.stringify({
          path: input,
          filesToIgnore: filesToIgnore
        }),
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
    {isLoading? (
        <LoadingRing />
    ):(
    <div>
    <Navbar />
        <div className="GetIgnorecontainer">
          <label className="pathsearchrow">
            <div className="pathsearchlabel">
                Train AI on Path:
            </div>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              className="pathsearchbar"
            />
          </label>
          <div className="gitIgnorebuttoncontainer">

            <div>
              <button onClick={handleGetGitIgnore} className="gitIgnorebutton">
                Analyze Files
              </button>
              <button onClick={handleTrain} className="gitIgnorebutton">
                Start Training
              </button>
            </div>
          </div>
        </div>
        <div className="filesdiff">
              {
              (showFilesToIgnore && showFilesToAnalyze) ? (
                    <div className="ignorecontainer">
                      <div className="ignorebox1">
                        <div className="ignoretext">
                          <h2>Files to Analyze:</h2>
                            <table className = "ignoretable">
                                  <thead>
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
                                        <td> {file.Tokens}</td>
                                        <td> {file.Sign}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                 <h4>
                                    ✅ : All good
                                 </h4>
                                 <h4>
                                    ⚠️ : File too long
                                 </h4>
                                 <h4>
                                    ℹ️ : File is not text
                                 </h4>
                        </div>
                      </div>
                       <div className="ignorebox2">
                            <div className="ignoretext">
                                <div className="ignoretitle">
                                    <h2>Files to Ignore:
                                    <div className="saveIgnoreButton">
                                    <button onClick={handleSaveFilesToIgnore} className="saveIgnoreButton">
                                        Save
                                    </button>
                                    </div>
                                    </h2>
                                </div>
                           {
                              <textarea
                                className="ignoretextarea"
                                placeholder="Type files you want the AI to ignore here"
                                value={filesToIgnore.join('\n')}
                                onChange={(event) => setFilesToIgnore(event.target.value.split('\n'))}
                              />
                           }
                         </div>
                       </div>
                    </div>
                    ):
                    (
                        <div className="ignorecontainer">
                            <div className="ignoretips" style={{
                              marginTop: '10px',
                              marginLeft: '10%',
                              width: '35%',
                            }}>
                            <h2>All Files</h2>
                            <FilesTree data={Treedata} />
                            
                            </div>
                            <div className="ignorebox2">
                            <div className="ignoretext">
                                <div className="ignoretitle">
                                    <h2>Files to Ignore:
                                    <div className="saveIgnoreButton">
                                    <button onClick={handleSaveFilesToIgnore} className="saveIgnoreButton">
                                        Save
                                    </button>
                                    </div>
                                    </h2>
                                </div>
                           {
                              <textarea
                                className="ignoretextarea"
                                placeholder="Type files you want the AI to ignore here"
                                value={filesToIgnore.join('\n')}
                                onChange={(event) => setFilesToIgnore(event.target.value.split('\n'))}
                              />
                           }
                         </div>
                       </div>
                        </div>
                    )
              }
        </div>
    </div>
    )}
  </div>
   
    );
};

export default Train;
