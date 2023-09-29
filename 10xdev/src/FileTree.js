
import React, { useContext, useState, useEffect } from "react";
import { DiJavascript, DiCss3, DiNpm } from "react-icons/di";
import {
  FaList,
  FaPython,
  FaReadme,
  FaFolderOpen,
  FaFolder,
} from "react-icons/fa";
import { BsFiletypeJsx, BsFiletypeScss } from "react-icons/bs";
import { RiFileCodeLine } from "react-icons/ri";
import TreeView, { flattenTree } from "react-accessible-treeview";
import SearchContext from "./context/SearchContext";

function DirectoryTreeView(props) {
  const [filteredData, setFilteredData] = useState(flattenTree(props.data));
  const [countFiles, setCountFiles] = useState(props.CountFiles);
  const [Alldata, setAlldata] = useState(props.data);
  const {
    checkedFiles,
    setCheckedFiles,
    showCheckboxes,
    setShowCheckboxes,
    expandedNodes,
    setExpandedNodes,
    filesearchTerm,
    setFileSearchTerm,
    filesToIgnore,
    setFilesToIgnore,
  } = useContext(SearchContext);

  const handleFileCheck = async (filename, isBranch) => {
    if (isBranch) {
      // If it's a folder (branch), simply return without modifying the checkedFiles state.
      return;
    }

    if (checkedFiles.includes(filename)) {
      await setCheckedFiles((prevCheckedFiles) =>
        prevCheckedFiles.filter((file) => file !== filename)
      );
    } else {
      await setCheckedFiles((prevCheckedFiles) => [
        ...prevCheckedFiles,
        filename,
      ]);
    }
  };

  useEffect(() => {
    filterData();
    
  }, [filesearchTerm]);

  useEffect(() => {
    console.log(Alldata)
    setAlldata(props.data);
  }, [props.data]);

  const filterData = async () => {
    if (!filesearchTerm.trim()) {
      setFilteredData(flattenTree(props.data));
      return;
    }

    const searchTerm = filesearchTerm.toLowerCase();
    const allData = flattenTree(props.data);

    const filteredData = allData.filter((node) =>
      node.name.toLowerCase().includes(searchTerm)
    );

    const rootNode = {
      id: 0,
      name: "",
      children: filteredData.map((node) => node.id),
      parent: null,
      code:"",
      extention:""
    };

    filteredData.unshift(rootNode);
    setFilteredData(filteredData);
  };

  const data = flattenTree(props.data);

  const calculateIndentation = (level) => {
    const percentage = 5 * (level - 1);
    return `${percentage}%`;
  };

  const modifiedData = filteredData.map((node) => ({
    ...node,
    defaultExpanded: true, // Set defaultExpanded to true for each node
  }));

  const calculateTotalFiles = (node, filteredData) => {
    let count = 0;

    // If the node is a file, return 1
    if (!node.children || node.children.length === 0) {
      return 1;
    }

    for (const childId of node.children) {
      const childNode = data.find((node) => node.id === childId);
      if (childNode) {
        count += calculateTotalFiles(childNode, filteredData);
      }
    }

    return count;
  };
  const [hoveredFolder, setHoveredFolder] = useState(null);

  const handleAddButtonClick = (element) => {
    const folderPath = [element.name];
    let currentNodeId = element.parent;
    while (currentNodeId) {
      const parentNode = data.find((node) => node.id === currentNodeId);
      if (parentNode) {
        folderPath.unshift(parentNode.name);
        currentNodeId = parentNode.parent;
      } else {
        break;
      }
    }
    const folderPathString = folderPath.join("/");
  
    // Check if the folderPathString exists in the filtered data
    const folderNode = filteredData.find((node) => node.name === folderPathString);
  
    if (folderNode) {
      const updatedFilesToIgnore = [...filesToIgnore, folderPathString];
      setFilesToIgnore(updatedFilesToIgnore);
    }
  };
  

  const getfilecodefromfilteredData = (filename, node) => {
    if (!node) {
      return "";
    }
  
    if (node.name === filename) {
      props.onFileClick(node.name ,node.code, node.extension);
      return;
    }
  
    if (node.children && node.children.length > 0) {
      for (const childNode of node.children) {
        try{
          getfilecodefromfilteredData(filename, childNode);
        }catch(e){
          console.log(e);
        }
      }
    }
  };

  const handleClearSearch = () => {
      setFileSearchTerm("");
    };

  return (
    <div className="">
        <div className="flex w-full justify-center mt-1 border-b ">
                <input
                  type="text"
                  value={filesearchTerm}
                  onChange={(e) => setFileSearchTerm(e.target.value)}
                  onKeyUp={() => filterData()}
                  placeholder="Search files..."
                  className="w-full px-2 py-1 border-none outline-none rounded-md focus:outline-none mb-0"
                />
                {filesearchTerm && (
                  <button
                    className="text-gray-500 mx-3 hover:text-gray-800"
                    onClick={handleClearSearch}
                  >
                    &#x2715;
                  </button>
                )}
              </div>
      <div className="px-4 pt-2 bg-white h-full font-mono text-base text-gray-800 select-none rounded-md">
        <TreeView
          data={filteredData}
          aria-label="directory tree "
          nodeRenderer={({
            element,
            isBranch,
            isExpanded,
            getNodeProps,
            level,
          }) => (
            <div
              {...getNodeProps({ isExpanded })}
              style={{ paddingLeft: calculateIndentation(level) }}
              onMouseEnter={() => setHoveredFolder(element.id)}
              onMouseLeave={() => setHoveredFolder(null)}
            >
              <label className="flex items-center cursor-pointer">
                {showCheckboxes && (
                  <input
                    type="checkbox"
                    className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                    checked={checkedFiles.includes(element.name)}
                    onChange={() => {
                      handleFileCheck(element.name, isBranch);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                {isBranch ? (
                  <div className="w-[80%]">
                    <div className="flex">
                      <div className="">
                        <FolderIcon
                          isOpen={isExpanded}
                          onClick={() =>
                            getNodeProps({
                              nodeId: element.id,
                              isExpanded: !isExpanded,
                            })
                          }
                        />
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={() =>
                          getNodeProps({
                            nodeId: element.id,
                            isExpanded: !isExpanded,
                          })
                        }
                      >
                        {element.name}
                      </div>
                      {countFiles && (
                        <div
                          className={`text-xs bg-blue-900 text-white rounded-md px-4 ml-auto my-auto transition-opacity ${
                            hoveredFolder === element.id
                              ? "opacity-100 pointer-events-auto hover:bg-blue-800"
                              : "opacity-0 pointer-events-none"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddButtonClick(element);
                          }}
                        >
                          Add Folder
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex w-full">
                    <div>
                      <FileIcon filename={element.name} />
                    </div>
                   { props.landingpage==="true"?<div
                      onClick={() => {
                        getfilecodefromfilteredData(element.name,Alldata)
                      }}
                    >
                      {element.name}
                    </div>: element.name
                    }
 
                    {countFiles && (
                      <div
                        className={`text-xs bg-blue-900 text-white rounded-md px-4 ml-auto my-auto transition-opacity ${
                          hoveredFolder === element.id
                            ? "opacity-100 pointer-events-auto hover:bg-blue-800"
                            : "opacity-0 pointer-events-none"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddButtonClick(element);
                        }}
                      >
                        Add File
                      </div>
                    )}
                  </div>
                )}
                {isBranch && countFiles && (
                  <span className="ml-auto text-gray-500">
                    ({calculateTotalFiles(element)}{" "}
                    {calculateTotalFiles(element) === 1 ? "file" : "files"})
                  </span>
                )}
              </label>
            </div>
          )}
        />
      </div>
    </div>
  );
}

const FolderIcon = ({ isOpen }) =>
  isOpen ? (
    <FaFolderOpen className="inline-block align-middle mr-1 text-blue-900" />
  ) : (
    <FaFolder className="inline-block align-middle mr-1 text-blue-900 " />
  );

const FileIcon = ({ filename }) => {
  const extension = filename.slice(filename.lastIndexOf(".") + 1);
  switch (extension) {
    case "js":
      return (
        <DiJavascript
          color="rgb(217 119 6)"
          className="inline-block align-middle mr-1"
        />
      );
    case "css":
      return (
        <DiCss3
          color="rgb(22 163 74)"
          className="inline-block align-middle mr-1"
        />
      );
    case "json":
      return (
        <FaList
          color="rgb(3 105 161)"
          className="inline-block align-middle mr-1"
        />
      );
    case "npmignore":
      return <DiNpm color="red" className="inline-block align-middle mr-1" />;
    case "jsx":
      return (
        <BsFiletypeJsx
          color="blue"
          className="inline-block align-middle mr-1"
        />
      );
    case "scss":
      return (
        <BsFiletypeScss
          color="rgb(13 148 136)"
          className="inline-block align-middle mr-1"
        />
      );
    case "py":
      return (
        <FaPython
          color="rgb(13 148 136)"
          className="inline-block align-middle mr-1"
        />
      );
    case "md":
      return (
        <FaReadme color="black" className="inline-block align-middle mr-1" />
      );
    case "ts":
    case "yml":
    case "html":
      return (
        <RiFileCodeLine
          color="black"
          className="inline-block align-middle mr-1"
        />
      );
    default:
      return (
        <RiFileCodeLine
          color="black"
          className="inline-block align-middle mr-1"
        />
      );
  }
};

export default DirectoryTreeView;
