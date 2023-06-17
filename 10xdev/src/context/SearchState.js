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
  const userPic = defaultUserPic;

  function getRandomEmoji(emojiList) {
      // Generate a random index within the range of the emojiList array
      const index = Math.floor(Math.random() * emojiList.length);
      return emojiList[index];
  }


    useEffect(() => {
      const getResults = async () => {
        try {

          const code = Cookies.get('cognitoCode');

          if (code && searchTerm.length > 0) {
            setIsLoading(true);
            console.log("is loading set true by context provider", isLoading)
            const data = await callAPI(`/api/data?prompt=${searchTerm}`, {
              method: "POST",
              body: JSON.stringify({}),
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
        path,
        setPath,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchState;
