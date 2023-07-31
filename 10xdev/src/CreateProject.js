import React, { useState } from "react";

function CreateProject() {
  const [prompt, setPrompt] = useState("");
  const [clarifyingQuestions, setClarifyingQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const AskGPT(prompt)

  const handleSubmit = (event) => {
    event.preventDefault();
    // Call the AskGPT function with the prompt
    // and handle the response
    AskGPT(prompt)
      .then((response) => {
        // Extract the clarifying questions from the response
        const questions = extractClarifyingQuestions(response);
        setClarifyingQuestions(questions);
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
  };

  const handleAnswerChange = (event, index) => {
    const answers = [...userAnswers];
    answers[index] = event.target.value;
    setUserAnswers(answers);
  };

  const extractClarifyingQuestions = (response) => {
    const aiMessages = response.messages.filter(
      (message) => message.role === "ai"
    );
    const questions = aiMessages.map((message) => message.content);
    return questions;
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