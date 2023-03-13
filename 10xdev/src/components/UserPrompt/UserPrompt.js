import React, { useState } from "react";
import "./UserPrompt.css";

function UserPrompt() {
  const [userPrompt, setUserPrompt] = useState("Please enter the file name to be created");
  const [editingPrompt, setEditingPrompt] = useState(false);
  const [newPrompt, setNewPrompt] = useState(userPrompt);

  const handleEditPrompt = () => {
    setEditingPrompt(true);
    setNewPrompt(userPrompt);
  };

  const handleSavePrompt = () => {
    setUserPrompt(newPrompt);
    setEditingPrompt(false);
  };

  const handleCancelPrompt = () => {
    setEditingPrompt(false);
  };

  const handlePromptChange = (event) => {
    setNewPrompt(event.target.value);
  };

  return (
    <div className="userPromptContainer">
      <div className="userPicContainer">
        <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" className="avatar" />
      </div>
      <div className = "userTextCol">
          {editingPrompt ? (
            <div className="editUserPromptContainer">
              <input type="text" value={newPrompt} onChange={handlePromptChange} />
              <button className="saveButton" onClick={handleSavePrompt}>Save</button>
              <button className="cancelButton" onClick={handleCancelPrompt}>Cancel</button>
            </div>
          ) : (
            <div className="userPromptext">
              {userPrompt}
            </div>
          )}
      </div>
      <div className="editOptions">
        <span className="editIcon" onClick={handleEditPrompt}>&#x270E;</span>
        <span className="retryIcon">&#x21BA;</span>
      </div>
    </div>
  );
}

export default UserPrompt;
