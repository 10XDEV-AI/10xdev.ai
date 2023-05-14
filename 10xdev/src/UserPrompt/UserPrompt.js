import React, { useState, useEffect,useContext } from "react";
import SearchContext from "../context/SearchContext";
import "./UserPrompt.css";

function UserPrompt({indexval, searchTerm, onReprompt}) {
  const {setIsLoading,userPic} = useContext(SearchContext);
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
    <div className="userPromptContainer">
      <div className="userPicContainer">
        {userPic}
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
          ✏️
        </span>
        <span className="retryIcon"  onClick={handleRetry}>
          🔄
        </span>
      </div>
    </div>
  );
}

export default UserPrompt;