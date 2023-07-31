import React, { useState } from "react";
import { callAPI } from "./api";

function CreateProject() {
  const [prompt, setPrompt] = useState("");
  const [clarifyingQuestions, setClarifyingQuestions] = useState("");
  const [userAnswers, setUserAnswers] = useState("");
  const [userClarifyingAnswers, setUserClarifyingAnswers] = useState("");

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const body = JSON.stringify({ prompt: prompt });

    try {
      // Make sure the body is a valid JSON string
      console.log(body);

      const response = await callAPI("/api/new_project", {
        method: "POST",
        body: body,
      });
      console.log(response);
      setClarifyingQuestions(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAnswerChange = (event) => {
    setUserClarifyingAnswers(event.target.value);
  };

  const handleClarifyingQuestionsSubmit = async () => {
    try {
      const response = await callAPI("/api/create_project_with_clarity", {
        method: "POST",
        body: JSON.stringify({
          prompt,
          clarifyingQuestions,
          userClarifyingAnswers,
        }),
      });
      // Handle the response as needed
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-10">
    <h1 class="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl ">Create your project in just few steps</h1>
    <p class="mb-6 text-lg font-normal text-gray-500 lg:text-xl ">Describe your project. AI will ask clarifying questions next</p>
        <form onSubmit={handleSubmit}>
           <div class="w-full mb-4  border border-gray-200 rounded-lg bg-gray-50 ">
               <div class="px-4 py-2 bg-white rounded-t-lg ">
                   <label for="comment" class="sr-only">Your comment</label>
                   <textarea onChange={handlePromptChange} id="comment" rows="4" class="w-full px-0 text-sm text-gray-900 bg-white border-0 focus:ring-0 " placeholder="Write a comment..." required></textarea>
               </div>
               <div class="flex items-center justify-between px-3 py-2 border-t ">
                   <button type="submit" class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800">
                       Submit
                   </button>
               </div>
           </div>
        </form>

      {clarifyingQuestions.length > 0 && (
        <div>
         <h1 class="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl ">Clarifying Questions:</h1>
          <p className="whitespace-pre-line p-5  ">
          {clarifyingQuestions}
          </p>
            <form className="mx-4 ">
               <div class="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 ">
                   <div class="px-4 py-2 bg-white rounded-t-lg ">
                       <label for="comment" class="sr-only">Your comment</label>
                       <textarea
                        onChange={() => handleAnswerChange()}
                        id="comment" rows="4" class="w-full px-0 text-sm text-gray-900 bg-white border-0 focus:ring-0 "
                        placeholder="Add clarifying answers here" required>
                       </textarea>
                   </div>
                   <div class="flex items-center justify-between px-3 py-2 border-t ">
                       <button  onClick={handleClarifyingQuestionsSubmit} type="submit" class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800">
                            Submit
                       </button>
                   </div>
               </div>
            </form>
        </div>
      )}
    </div>
  );
}

export default CreateProject;
