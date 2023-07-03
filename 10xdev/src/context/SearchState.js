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
  const [isnewuser, setIsNewUser] = useState(localStorage.getItem('isNewUser') === 'true');
  const [path,setPath] = useState('');
  const emojis = ["🧑‍🦱", "🧑‍🦰", "🧑‍🦳", "🧑‍🎨", "🧑‍💼", "🧑‍🚀", "🧑‍🔬", "🧑‍🎤", "🧑‍🚒", "🧑‍🏫", "🧑‍🔧", "🧑‍🍳", "🧑‍🎓", "🧑‍💻", "🧑‍🚀", "🧑‍🌾", "🧑‍🏭", "🧑‍🎨", "🥷🏻"];
  const defaultUserPic = getRandomEmoji(emojis);
  const [showSync, setShowSync] = useState(false);
  const userPic = defaultUserPic;
  const [showRepos, setShowRepos] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [checkedFiles, setCheckedFiles] = useState([]);


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
    callAPI('/api/Repos')
      .then(data => {
        setRepos(data)
        console.log("repos", data);
        if(data.length> 0){
          localStorage.setItem("isNewUser", "false");
          setIsNewUser(false);
        }else{
          localStorage.setItem("isNewUser", "true");
          setIsNewUser(true);
        }
      })
      .catch(error => console.error(error));
  }, []);

    useEffect(() => {
      const getResults = async () => {
        try {

          const code = Cookies.get('cognitoCode');

          if (code && searchTerm.length > 0) {
            setIsLoading(true);
            console.log("is loading set true by context provider", isLoading)
            const data = await callAPI(`/api/data`, {
              method: "POST",
              body: JSON.stringify({checkedFiles:checkedFiles, prompt:searchTerm}),
            });
            setFiles(data.files);
            setResults(data.response);
            setreferenced_code(data.referenced_code);
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
        isnewuser, setIsNewUser,
        showRepos, setShowRepos,
        checkedFiles, handleFileCheck,
        repos, setRepos,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchState;
