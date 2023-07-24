import React from "react";
import {useContext} from "react";
import { DiJavascript, DiCss3, DiNpm } from "react-icons/di";
import { FaList, FaPython, FaReadme, FaFolderOpen, FaFolder } from "react-icons/fa";
import { BsFiletypeJsx, BsFiletypeScss } from "react-icons/bs";
import { RiFileCodeLine } from "react-icons/ri";
import TreeView, { flattenTree } from "react-accessible-treeview";
import SearchContext from './context/SearchContext';

function DirectoryTreeView(props) {
  const {checkedFiles,setCheckedFiles, showCheckboxes, setShowCheckboxes, expandedNodes, setExpandedNodes} = useContext(SearchContext);
    const handleFileCheck = async (filename) => {
      if (checkedFiles.includes(filename)) {
        await setCheckedFiles((prevCheckedFiles) =>
          prevCheckedFiles.filter((file) => file !== filename)
        );
      } else {
        // If the file is not checked, add it to the checkedFiles state
        await setCheckedFiles((prevCheckedFiles) => [...prevCheckedFiles, filename]);
      }
    };

  const data = flattenTree(props.data);

  const calculateIndentation = (level) => {
    const percentage = 5 * (level - 1);
    return `${percentage}%`;
  };

  const modifiedData = data.map((node) => ({
    ...node,
    defaultExpanded: true, // Set defaultExpanded to true for each node
  }));

  return (
    <div className="">
      <div className="p-4 bg-white h-full font-mono text-base text-gray-800 select-none rounded-md">
        <TreeView
          data={modifiedData}
          aria-label="directory tree "
          nodeRenderer={({ element, isBranch, isExpanded, getNodeProps, level }) => (
            <div {...getNodeProps()} style={{ paddingLeft: calculateIndentation(level) }}>
              <label className="flex items-center cursor-pointer">
                {showCheckboxes && (
                  <input
                    type="checkbox"
                    className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                    checked={checkedFiles.includes(element.name)}
                    onChange={() => {handleFileCheck(element.name);}}
                    onClick={(e) => e.stopPropagation()} // Stop event propagation
                  />
                )}

                {isBranch ? (
                  <FolderIcon
                    isOpen={isExpanded}
                    onClick={() => getNodeProps({ nodeId: element.id, isExpanded: !isExpanded })}
                  />
                ) : (
                  <FileIcon filename={element.name} />
                )}
                {element.name}
              </label>
            </div>
          )}
        />
      </div>
    </div>
  );
}

const FolderIcon = ({ isOpen }) =>
  isOpen ? <FaFolderOpen className="inline-block align-middle mr-1 text-blue-900" /> : <FaFolder className="inline-block align-middle mr-1 text-blue-900 " />;

const FileIcon = ({ filename }) => {
  const extension = filename.slice(filename.lastIndexOf(".") + 1);
  switch (extension) {
    case "js":
      return <DiJavascript color="rgb(217 119 6)" className="inline-block align-middle mr-1" />;
    case "css":
      return <DiCss3 color="rgb(22 163 74)" className="inline-block align-middle mr-1" />;
    case "json":
      return <FaList color="rgb(3 105 161)" className="inline-block align-middle mr-1" />;
    case "npmignore":
      return <DiNpm color="red" className="inline-block align-middle mr-1" />;
    case "jsx":
      return <BsFiletypeJsx color="blue" className="inline-block align-middle mr-1" />;
    case "scss":
      return <BsFiletypeScss color="rgb(13 148 136)" className="inline-block align-middle mr-1" />;
    case "py":
      return <FaPython color="rgb(13 148 136)" className="inline-block align-middle mr-1" />;
    case "md":
      return <FaReadme color="black" className="inline-block align-middle mr-1" />;
    case "ts":
    case "yml":
    case "html":
      return <RiFileCodeLine color="black" className="inline-block align-middle mr-1" />;
    default:
      return <RiFileCodeLine color="black" className="inline-block align-middle mr-1" />;
  }
};

export default DirectoryTreeView;
