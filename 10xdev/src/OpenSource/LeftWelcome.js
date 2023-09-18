import React, { useContext, useState ,useEffect} from "react";
import { Link, useNavigate } from 'react-router-dom';
import SearchContext from "../context/SearchContext";
import "../Welcome.css";
import ProjectInfo from "../ProjectInfo/ProjectInfo";
import LoadingRing from "../Loader/Loader";
import FileTree from "../FileTree";
import Sync from "./Sync";
import { CopyBlock,irBlack } from "react-code-blocks";
import Alert from "../UiComponents/alert";
import { openAPI } from "../api";
  
export const LeftWelcome = ({ isTreeLoading, treeData, filesearchTerm, filesShow ,setFilesShow, showalert,setShowalert}) => {
  const { isLoading,showSync, setShowSync,isLoadingProjectInfo , commitHash, commitTime, checkedFiles, setCheckedFiles, showCheckboxes, setShowCheckboxes, setFileSearchTerm, repository, branch} = useContext(SearchContext);
  const handleSyncClick = () => {
    setShowSync(true);
  };
  

  const [showcode, setShowcode] = useState(false);
  var id=0;
  const handleFileClick = (filename,filecode, fileData) => {
    id=id+1;
    setFilesShow([{_id :id+1,name: filename, code: filecode, extention: fileData },...filesShow ]);
    setShowcode(true);
  };

  const handleSummaryFileClick = async () => {
      const code = await openAPI("/api/os_summary", {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
              },
              body : JSON.stringify({
                  repository : repository,
              }),
          });

      console.log(code);
      setFilesShow(prevFilesShow => [
        { _id: id + 1, name: "Summary", code: code.summary, extention: "txt" },
        ...prevFilesShow
      ]);
      setShowcode(true);
    }

  const navigate = useNavigate();

  const handleFilterClick = () => {
    setShowCheckboxes(!showCheckboxes);
    setCheckedFiles([])
    setFileSearchTerm("");
  };

  if (isLoading) {
    return (
      <div  className="h-screen">
          <LoadingRing dontLog="true"/>
        </div>
    )
  } else {
    return (
      <div className="p-6 bg-slate-50 h-screen">
        {showSync ? (
          <div className="py-2 h-[90vh]">
            <Sync />
          </div>
        ) : (
          <>
                <div className="flex items-center text-blue-900 h-[16vh]">
                  <h1 className="text-2xl">
                     <>
                       <ProjectInfo isLoadingProjectInfo={isLoadingProjectInfo} repository={repository} branch={branch} />
                     </>
                  </h1>
                  <button className="ml-auto rounded  hover:text-blue-600" onClick={() => handleSummaryFileClick()}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                </div>
                <div className="h-[57vh] overflow-y-auto overflow-x-hidden ">
                  <div className="flex items-center justify-center">
                    <h2 className="text-xl font-bold mb-2">Your code:</h2>
                    {/* Filter Icon */}
                    <button className="font-bold px-1 rounded-md ml-auto" onClick={handleFilterClick}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 my-1">
                        <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div className="bg-white border border-gray-400 h-[50vh] overflow-y-auto rounded-lg shadow-md">
                    {isTreeLoading ? (
                      <div className="flex justify-center items-center h-[50vh] text-gray-500">
                        Loading......
                      </div>
                    ) : (
                      <FileTree data={treeData} showCheckboxes={showCheckboxes} landingpage="true" showcode={showcode} setShowcode={setShowcode} filesShow={filesShow} setFilesShow={setFilesShow} onFileClick={handleFileClick}  />
                    )}
                  </div>
                </div>
                <div className="flex items-center text-blue-900 justify-center pt-4">
                  <div className="">
                    <h1 className="font-bold"> Last synced commit hash : #{commitHash}</h1>
                    <h1 className="font-bold"> Last synced {commitTime}</h1>
                  </div>
                  <button className="bg-blue-900 text-white font-bold p-2 rounded ml-auto hover:bg-blue-600 shadow-md flex" onClick={handleSyncClick}>
                    Sync
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 m-1">
                      <path fill-rule="evenodd" d="M10 4.5c1.215 0 2.417.055 3.604.162a.68.68 0 01.615.597c.124 1.038.208 2.088.25 3.15l-1.689-1.69a.75.75 0 00-1.06 1.061l2.999 3a.75.75 0 001.06 0l3.001-3a.75.75 0 10-1.06-1.06l-1.748 1.747a41.31 41.31 0 00-.264-3.386 2.18 2.18 0 00-1.97-1.913 41.512 41.512 0 00-7.477 0 2.18 2.18 0 00-1.969 1.913 41.16 41.16 0 00-.16 1.61.75.75 0 101.495.12c.041-.52.093-1.038.154-1.552a.68.68 0 01.615-.597A40.012 40.012 0 0110 4.5zM5.281 9.22a.75.75 0 00-1.06 0l-3.001 3a.75.75 0 101.06 1.06l1.748-1.747c.042 1.141.13 2.27.264 3.386a2.18 2.18 0 001.97 1.913 41.533 41.533 0 007.477 0 2.18 2.18 0 001.969-1.913c.064-.534.117-1.071.16-1.61a.75.75 0 10-1.495-.12c-.041.52-.093 1.037-.154 1.552a.68.68 0 01-.615.597 40.013 40.013 0 01-7.208 0 .68.68 0 01-.615-.597 39.785 39.785 0 01-.25-3.15l1.689 1.69a.75.75 0 001.06-1.061l-2.999-3z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div class="w-full bg-slate-50 rounded-lg mt-10">
                    <div class="flex flex-wrap gap-2 justify-center items-center" >
                      {checkedFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex text-blue-500 border border-blue-500 py-1 px-6 gap-1 rounded-full text-sm font-semibold justify-center items-center">
                            {file}
                          </div>
                        </div>
                      ))}
                    </div>
                </div>
          </>
        )}
      </div>
    );
  };
}

export default LeftWelcome;