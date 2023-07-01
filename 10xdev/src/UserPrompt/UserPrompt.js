import React, { useState, useEffect,useContext } from "react";
import SearchContext from "../context/SearchContext";
import "./UserPrompt.css";
import {MdEdit} from 'react-icons/md';
import {IoSyncCircleSharp} from 'react-icons/io5';
function UserPrompt({indexval, searchTerm, onReprompt}) {
  const {userPic} = useContext(SearchContext);
  const [userPrompt, setUserPrompt] = useState(searchTerm);
  const [editingPrompt, setEditingPrompt] = useState(false);

   useEffect(() => {
      setUserPrompt(searchTerm);
    }, [searchTerm]);

  // Define an array of emojis

  const handleEditPrompt = () => {
    setEditingPrompt(true);
  };

  const handleSavePrompt = async (e) => {
    setEditingPrompt(false);
    onReprompt(userPrompt,indexval);
  };

  const handleCancelPrompt = () => {
    setEditingPrompt(false);
    setUserPrompt(userPrompt);
  };

  const handlePromptChange = (event) => {
    setUserPrompt(event.target.value);
  };

  const handleRetry = () => {
    onReprompt(userPrompt,indexval);
  };
  return (
    <div className="userPromptContainer bg-slate-50 border-b-0 border-gray-300">
      <div className="userPicContainer">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 mx-auto mt-1">
          <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
        </svg>
      </div>
      <div className="userTextCol">
        {editingPrompt ? (
          <div className="editUserPromptContainer">
            <input
              type="text"
              value={userPrompt}
              onChange={handlePromptChange}
            />
            <button className="saveButton" onClick={handleSavePrompt}>
              Save & Submit
            </button>
            <button className="cancelButton" onClick={handleCancelPrompt}>
              Cancel
            </button>
          </div>
        ) : (
          <div className="userPromptext">{userPrompt}</div>
        )}
      </div>
      <div className="editOptions">
        <span className="editIcon" onClick={handleEditPrompt}>
        <MdEdit className="text-xl text-blue-900" />
        </span>
        <span className="retryIcon"  onClick={handleRetry}>
          <IoSyncCircleSharp className="text-xl text-blue-900" color =""/>
        </span>
      </div>
    </div>
  );
}

export default UserPrompt;