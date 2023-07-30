import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Audio, Dna, InfinitySpin, Oval, RevolvingDot, Rings } from 'react-loader-spinner';
import './Loader.css';
import LogViewer from './LogViewer/LogViewer';
import SearchContext from '../context/SearchContext';

const LoadingRing = ({RedirectTo, dontLog }) => {
  const { setIsLoading, logFiles } = useContext(SearchContext);
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
    <div className="loading-ring-container">
      <div className="loading-ring">{randomLoader}</div>
      {dontLog === 'true' ? null : (
      <>
        <div className="logbox pt-10">
          <LogViewer RedirectTo={RedirectTo} />
        </div>
        <div className="w-full flex flex-wrap gap-2 justify-center items-center mt-10">
        {logFiles.length>0&&
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
            </svg>
          </div>
        }
        {logFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 ">
                      <div className="flex text-blue-500 border border-blue-500 py-0 pl-6 gap-1 pr-2 rounded-full text-sm font-semibold justify-center items-center">
                        {file}
                          <button
                              className="text-slate-50 hover:text-blue-500"
                          >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
            </div>
      </>
      )}
    </div>
  );
};

export default LoadingRing;
