import React, { useState, useEffect,useContext } from "react";
import SearchContext from "../context/SearchContext";
import "./UserPrompt.css";

function UserPrompt({indexval, searchTerm, onChildData, onRetry}) {
  const {isLoading,setIsLoading,userPic} = useContext(SearchContext);
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
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/data?prompt=${userPrompt}`
      );
      const data = await response.json();
      onChildData(data, indexval, userPrompt);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const handleCancelPrompt = () => {
    setEditingPrompt(false);
    setUserPrompt(userPrompt);
  };

  const handlePromptChange = (event) => {
    setUserPrompt(event.target.value);
  };

  const handleRetry = () => {
    onRetry(userPrompt);
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