import React, { useState } from "react";
import { callAPI } from "./api";

function CreateProject() {
  const [prompt, setPrompt] = useState("");
  const [clarifyingQuestions, setClarifyingQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [userClarifyingAnswers, setUserClarifyingAnswers] = useState([]);

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await callAPI("/api/new_project", {
        method: "POST",
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
    <div>
      <h1 className="w-full text-2xl">New Page</h1>
      <h2 htmlFor="prompt" className="w-full text-xl">Enter a project prompt:</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="prompt"
          value={prompt}
          onChange={handlePromptChange}
          className="border rounded px-4 py-2 w-full"
        />
        <button type="submit" className="bg-blue-900 text-white px-4 py-2 mt-4 rounded">
          Submit
        </button>
      </form>

      {clarifyingQuestions.length > 0 && (
        <div>
          <h2>Clarifying Questions:</h2>
          {clarifyingQuestions.map((question, index) => (
            <div key={index} className="mt-4">
              <p>{question}</p>
              <input
                type="text"
                value={userAnswers[index] || ""}
                onChange={(event) => handleAnswerChange(event, index)}
                className="border rounded px-4 py-2 w-full mt-2"
              />
            </div>
          ))}
          <button
            type="submit"
            onClick={handleClarifyingQuestionsSubmit}
            className="bg-blue-900 text-white px-4 py-2 mt-4 rounded"
          >
            Submit Clarifying Answers
          </button>
        </div>
      )}
    </div>
  );
}

export default CreateProject;
