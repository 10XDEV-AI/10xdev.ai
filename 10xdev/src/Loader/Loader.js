import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Audio, Dna, InfinitySpin, Oval, RevolvingDot, Rings } from 'react-loader-spinner';
import './Loader.css';
import LogViewer from './LogViewer/LogViewer';
import SearchContext from '../context/SearchContext';

const LoadingRing = ({RedirectTo,dontLog}) => {
  const { setIsLoading } = useContext(SearchContext);
  const navigate = useNavigate();

  const handleRunInBackground = () => {
    setIsLoading(false);
    navigate('/welcome');
  };

  const loaders = [
    <Dna
      visible={true}
      height={80}
      width={80}
      ariaLabel="dna-loading"
      wrapperStyle={{}}
      wrapperClass="dna-wrapper"
      key="dna-loader"
    />,
    <Oval
          height={80}
          width={80}
          color="#87CEEB"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#000066"
          strokeWidth={2}
          strokeWidthSecondary={2}
          key="oval-loader"
        />,
        <Rings
          height={80}
          width={80}
          color="#000066"
          radius={6}
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="rings-loading"
          key="rings-loader"
        />,

  ];

  // Randomly select a loader
  const randomLoader = loaders[Math.floor(Math.random() * loaders.length)];

  return (
    <div>
      <div className="loading-ring">{randomLoader}</div>
      {dontLog==="true" ? null : (
      <div className="logbox">
        <LogViewer RedirectTo={RedirectTo} />
      </div>
      )}
    </div>
  );
};

export default LoadingRing;
