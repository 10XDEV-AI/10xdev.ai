import React, { useState, useEffect,useContext } from "react";

import "./UserPrompt.css";

function UserPrompt({indexval, searchTerm, onChildData, onRetry}) {

  const [userPrompt, setUserPrompt] = useState(searchTerm);
  const [editingPrompt, setEditingPrompt] = useState(false);

   useEffect(() => {
      setUserPrompt(searchTerm);
    }, [searchTerm]);

  // Define an array of emojis
  const emojis = ["🧓", "🧑‍🦱", "🧑‍🦰", "🧑‍🦳", "🧑‍🎨", "🧑‍💼", "🧑‍🚀", "🧑‍🔬", "🧑‍🎤", "🧑‍🚒", "🧑‍🏫", "🧑‍🔧", "🧑‍🍳", "🧑‍🎓", "🧑‍💻", "🧑‍🚀", "🧑‍🌾", "🧑‍🏭", "🧑‍🎨", "🥷🏻"];

  function getRandomEmoji(emojiList) {
      // Generate a random index within the range of the emojiList array
      const index = Math.floor(Math.random() * emojiList.length);

      // Return the emoji at the randomly generated index
      return emojiList[index];
  }

  // Call the getRandomEmoji function and store the result in a variable
  const randomEmoji = getRandomEmoji(emojis);

  return (
    <div className="userPromptContainer">
      <div className="userPicContainer">
        {randomEmoji}
      </div>
      <div className="userTextCol">
        {editingPrompt ? (
          <div className="editUserPromptContainer">
            <input
              type="text"
              value={userPrompt}

            />
            <button className="saveButton">
              Save & Submit
            </button>
            <button className="cancelButton">
              Cancel
            </button>
          </div>
        ) : (
          <div className="userPromptext">{userPrompt}</div>
        )}
      </div>
      <div className="editOptions">
        <span className="editIcon" >
          ✏️
        </span>
        <span className="retryIcon" >
          🔄
        </span>
      </div>
    </div>
  );
}

export default UserPrompt;