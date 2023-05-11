import React, { useState,useEffect } from 'react';
import SearchContext from './SearchContext';

const SearchState = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProjectInfo, setIsLoadingProjectInfo] = useState(true);
  const [results, setResults] = useState('');
  const [referenced_code, setreferenced_code] = useState(''); //this is the reference code of the project
  const [files, setFiles] = useState('');
  const emojis = ["🧑‍🦱", "🧑‍🦰", "🧑‍🦳", "🧑‍🎨", "🧑‍💼", "🧑‍🚀", "🧑‍🔬", "🧑‍🎤", "🧑‍🚒", "🧑‍🏫", "🧑‍🔧", "🧑‍🍳", "🧑‍🎓", "🧑‍💻", "🧑‍🚀", "🧑‍🌾", "🧑‍🏭", "🧑‍🎨", "🥷🏻"];
  const defaultUserPic = getRandomEmoji(emojis);
  const userPic = defaultUserPic;

  function getRandomEmoji(emojiList) {
      // Generate a random index within the range of the emojiList array
      const index = Math.floor(Math.random() * emojiList.length);
      return emojiList[index];
  }

  useEffect(() => {
    //find errors in this useEffect which causing api call to be made twice

    const getResults = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://127.0.0.1:5000/api/data?prompt=${searchTerm}`
        );
        const data = await response.json();
        console.log(data);
        setFiles(data.files);
        setResults(data.response);
        setreferenced_code(data.referenced_code);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
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
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchState;
