import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Audio, Dna, InfinitySpin, Oval, RevolvingDot, Rings } from 'react-loader-spinner';
import './Loader.css';
import LogViewer from './LogViewer/LogViewer';
import SearchContext from '../context/SearchContext';

const LoadingRing = (RedirectTo) => {
  const { setIsLoading } = useContext(SearchContext);
  const navigate = useNavigate();

  const handleRunInBackground = () => {
    setIsLoading(false);
    navigate('/welcome');
  };

  const loaders = [
        <Rings
          height={60}
          width={60}
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
    <div className="w-full h-full flex flex-col items-center justify-center py-10">
      <div className="pb-5">{randomLoader}</div>
      <div className="text-center">
        <LogViewer RedirectTo={RedirectTo} />
      </div>
    </div>
  );
};

export default LoadingRing;
