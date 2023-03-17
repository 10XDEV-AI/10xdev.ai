import React, { useState } from 'react';

function Setup() {
  const [path, setPath] = useState(''); // initialize path state with an empty string
  const [loading, setLoading] = useState(false); // initialize loading state to false

  const handlePathChange = (event) => {
    setPath(event.target.value); // update path state when input field value changes
  }

  const handleButtonClick = async () => {
    setLoading(true); // set loading state to true before making API call
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/setup?path=${path}`);
      const data = await response.json();
      console.log(data); // assuming the API returns a JSON object
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // set loading state to false after API call is complete
    }
  }

  return (
    <div>
      <label htmlFor="path-input">Enter path:</label>
      <input type="text" id="path-input" value={path} onChange={handlePathChange} />
      <button onClick={handleButtonClick}>Submit</button>
      {loading && <div>Loading...</div>} {/* display loading symbol if loading state is true */}
    </div>
  );
}

export default Setup;
