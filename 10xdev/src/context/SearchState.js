import React, { useState, useEffect } from 'react';
import SearchContext from './SearchContext';
import Cookies from 'js-cookie';
import { callAPI } from '../api';

const SearchState = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProjectInfo, setIsLoadingProjectInfo] = useState(true);
  const [results, setResults] = useState('');
  const [referenced_code, setreferenced_code] = useState('');
  const [files, setFiles] = useState('');
  const [path,setPath] = useState('');
  const emojis = ["🧑‍🦱", "🧑‍🦰", "🧑‍🦳", "🧑‍🎨", "🧑‍💼", "🧑‍🚀", "🧑‍🔬", "🧑‍🎤", "🧑‍🚒", "🧑‍🏫", "🧑‍🔧", "🧑‍🍳", "🧑‍🎓", "🧑‍💻", "🧑‍🚀", "🧑‍🌾", "🧑‍🏭", "🧑‍🎨", "🥷🏻"];
  const defaultUserPic = getRandomEmoji(emojis);
  const [showSync, setShowSync] = useState(false);
  const userPic = defaultUserPic;
  const [showRepos, setShowRepos] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [checkedFiles, setCheckedFiles] = useState([]);
  const [currentuser, setCurrentUser] = useState();
  const [searchFiles, setSearchFiles] = useState([]);
  const [commitHash, setCommitHash] = useState("");
  const [repository, setRepository] = useState('');
  const [branch, setBranch] = useState('');
  const [treeData, setTreeData] = useState([]);
  const [sideContainerOpen, setSideContainerOpen] = useState(false);
  const [filesearchTerm, setFileSearchTerm] = useState("");

  const handleFileCheck = (file) => {
    // Check if the file is already in the checkedFiles array
    const isChecked = checkedFiles.includes(file);

    if (isChecked) {
      // File is already checked, remove it from the array
      setCheckedFiles((prevCheckedFiles) =>
        prevCheckedFiles.filter((checkedFile) => checkedFile !== file)
      );
    } else {
      // File is not checked, add it to the array
      setCheckedFiles((prevCheckedFiles) => [...prevCheckedFiles, file]);
    }
  };

  const [repos, setRepos] = useState([]);

  function getRandomEmoji(emojiList) {
      // Generate a random index within the range of the emojiList array
      const index = Math.floor(Math.random() * emojiList.length);
      return emojiList[index];
  }
  useEffect(() => {
    setCurrentUser(window.localStorage.getItem('currentuser'));
    console.log("current user",currentuser);
  }, []);



    useEffect(() => {
      const getResults = async () => {
        try {
          const code = Cookies.get('cognitoCode');

          if (code && searchTerm.length > 0) {
            setIsLoading(true);
            console.log("is loading set true by context provider", isLoading);
            setFiles("");
            setResults("");
            // First API call to get the files
            const filesData = await callAPI("/api/search_files", {
              method: "POST",
              body: JSON.stringify({
                checkedFiles: checkedFiles,
                prompt: searchTerm,
              }),
            });

            // Extract the files from the response
            const files = filesData.files;

            // Second API call to get the response
            const responseData = await callAPI("/api/get_response", {
              method: "POST",
              body: JSON.stringify({
                prompt: searchTerm,
                chatMessages: [], // Provide chatMessages if needed
                files: files, // Pass the obtained files from the first API call
              }),
            });

            setFiles(responseData.files);
            setResults(responseData.response);
            setreferenced_code(responseData.referenced_code);
            setIsLoading(false);
          }
        } catch (error) {
          setIsLoading(false);
          console.error(error);
        }
      };

      getResults();
    }, [searchTerm]);


  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        isLoading,
        setIsLoading,
        isLoadingProjectInfo,
        setIsLoadingProjectInfo,
        results,
        files,
        referenced_code,
        userPic,
        path, setPath,
        showSync, setShowSync,
        currentuser, setCurrentUser,
        showRepos, setShowRepos,
        checkedFiles, handleFileCheck,
        setCheckedFiles,
        repos, setRepos,
        commitHash,setCommitHash,
        repository, setRepository,
        branch, setBranch,
        sideContainerOpen, setSideContainerOpen,
        filesearchTerm, setFileSearchTerm,
        treeData, setTreeData
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchState;
