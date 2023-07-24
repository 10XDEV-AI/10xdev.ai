import React, { useState, useEffect,useContext } from "react";
import SearchContext from "../context/SearchContext";
import "./UserPrompt.css";
import {MdEdit} from 'react-icons/md';
import {IoSyncCircleSharp} from 'react-icons/io5';
function UserPrompt({indexval, searchTerm, onReprompt}) {
  const {userPic} = useContext(SearchContext);
  const [userPrompt, setUserPrompt] = useState(searchTerm);
  const [editingPrompt, setEditingPrompt] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

   const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };
  return (
    <div className="userPromptContainer bg-slate-50 border-b-0 border-gray-300" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="userPicContainer ">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 p-1 mx-auto mt-1 border border-gray-300 rounded bg-gray-900 text-white">
           <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      </div>
      <div className="userTextCol">
        {editingPrompt ? (
        <>
        <form>
           <div class="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
               <div class="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                   <label for="comment" class="sr-only">Your comment</label>
                   <textarea value={userPrompt}
                           onChange={handlePromptChange}
                           id="comment" rows="4" class="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder="Write a comment..." required></textarea>
               </div>
               <div class="flex items-center justify-end gap-4 px-3 py-2 border-t dark:border-gray-600">
                   <button class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 hover:bg-red-800" onClick={handleCancelPrompt}>
                       Cancel
                   </button>
                   <button type="submit" onClick={handleSavePrompt} class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                       Save & Submit
                   </button>

               </div>
           </div>
        </form>
        </>
        ) : (
          <div className="userPromptext">
             <p>
                {userPrompt}
             </p>
          </div>
        )}
      </div>
      {isHovered && !editingPrompt && (
        <div className="editOptions">
            <span className="editIcon text-gray-600" onClick={handleEditPrompt}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>
            </span>
            <span className="retryIcon text-gray-600"  onClick={handleRetry}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </span>
        </div>
      )}
    </div>
  );
}

export default UserPrompt;