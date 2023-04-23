import React, { useState } from 'react';
import './Train.css';

const Train = () => {
  const [input, setInput] = useState('');
  const [filesToAnalyze, setFilesToAnalyze] = useState('');
  const [filesToIgnore, setFilesToIgnore] = useState('');
  const [showTrainButton, setShowTrainButton] = useState(false);
  const [showFilesToIgnore, setShowFilesToIgnore] = useState(false);
  const [showFilesToAnalyze, setShowFilesToAnalyze] = useState(false);

  const handleInputChange = (event) => {
    setInput(event.target.value);
    setShowTrainButton(false);
    setShowFilesToIgnore(false);
    setShowFilesToAnalyze(false);
  };

  const handleGetGitIgnore = () => {
    fetch(`http://127.0.0.1:5000/api/Ignore?path=${input}`)
      .then((response) => response.json())
      .then((data) => {
        setFilesToAnalyze(
          JSON.stringify(data.files2analyze, null, 2)
        );
        setFilesToIgnore(
          JSON.stringify(data.files2ignore, null, 2)
        );
        setShowTrainButton(true);
        setShowFilesToIgnore(true);
        setShowFilesToAnalyze(true);
      });
  };

  const handleTrain = () => {
    fetch(`http://127.0.0.1:5000/api/train?prompt=${input}`)
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

  return (
    <div className="container">
      <label className="label">
        Path of repository to train:
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          className="input-field"
        />
      </label>
      <div>
        <button onClick={handleGetGitIgnore} className="button">
          Get GitIgnore
        </button>
        {showTrainButton && (
          <button onClick={handleTrain} className="button">
            Start Training
          </button>
        )}
      </div>
      {showFilesToIgnore && showFilesToAnalyze && (
        <div className="ignorebox">
          <div className="ignoretext">
            <h2>Files to Analyze:</h2>
            <pre>{filesToAnalyze}</pre>
          </div>
          <div className="ignoretext">
            <h2>Files to Ignore:</h2>
            <pre>{filesToIgnore}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default Train;
