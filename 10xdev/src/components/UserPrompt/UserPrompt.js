import React, { useState, useEffect } from "react";
import "./UserPrompt.css";

function UserPrompt({ searchInput, onRetry, onChildData  }) {
  const [userPrompt, setUserPrompt] = useState(searchInput);
  const [editingPrompt, setEditingPrompt] = useState(false);

  useEffect(() => {
    setUserPrompt(searchInput);
  }, [searchInput]);

  const handleEditPrompt = () => {
    setEditingPrompt(true);
  };

  const handleSavePrompt = async (e) => {
    setEditingPrompt(false);
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/data?prompt=${userPrompt}`
      );
      const data = await response.json();
      console.log(data);
      //add this data to last index we are currently CHANGING 0 
      onChildData(data, 0, userPrompt);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelPrompt = () => {
    setEditingPrompt(false);
    setUserPrompt(searchInput);
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
        <img
          src="https://www.w3schools.com/howto/img_avatar.png"
          alt="Avatar"
          className="avatar"
        />
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
          &#x270E;
        </span>
        <span className="retryIcon" onClick={handleRetry}>
          &#x21BA;
        </span>
      </div>
    </div>
  );
}

export default UserPrompt;
