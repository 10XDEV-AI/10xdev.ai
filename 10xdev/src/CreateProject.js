import React, { useState } from "react";
import { callAPI } from "./api";


function CreateProject() {
  const [prompt, setPrompt] = useState("");
  const [clarifyingQuestions, setClarifyingQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async (event) => {
   event.preventDefault();

   try {
     const response = await callAPI("/api/new_project", {
       method: "GET",
       body: JSON.stringify({ prompt }),
     });
     setClarifyingQuestions(response);
   } catch (error) {
     console.error(error);
   }
 };

  const handleAnswerChange = (event, index) => {
    const answers = [...userAnswers];
    answers[index] = event.target.value;
    setUserAnswers(answers);
  };

  return (
    <div>
      <h1>New Page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="prompt">Enter a project prompt:</label>
        <input
          type="text"
          id="prompt"
          value={prompt}
          onChange={handlePromptChange}
        />
        <button type="submit">Submit</button>
      </form>

      {clarifyingQuestions.length > 0 && (
        <div>
          <h2>Clarifying Questions:</h2>
          {clarifyingQuestions.map((question, index) => (
            <div key={index}>
              <p>{question}</p>
              <input
                type="text"
                value={userAnswers[index] || ""}
                onChange={(event) => handleAnswerChange(event, index)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CreateProject;