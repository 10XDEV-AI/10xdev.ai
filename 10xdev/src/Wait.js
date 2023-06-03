import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Wait = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const waitAndNavigate = setTimeout(() => {
      navigate('/welcome');
    }, 10000); // Wait for 1 minute (60000 milliseconds)

    return () => clearTimeout(waitAndNavigate); // Clear the timeout on unmount
  }, [navigate]);

  return (
    <div>
      <h1>Please wait for a minute...</h1>
    </div>
  );
};

export default Wait;
