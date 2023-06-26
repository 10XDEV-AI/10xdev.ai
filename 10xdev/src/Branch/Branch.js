import React, { useState } from "react";
import { DiJavascript, DiCss3, DiNpm } from "react-icons/di";
import { FaList, FaPython, FaReadme, FaFolderOpen, FaFolder } from "react-icons/fa";
import { BsFiletypeJsx, BsFiletypeScss } from "react-icons/bs";
import { RiFileCodeLine } from "react-icons/ri";
import TreeView, { flattenTree } from "react-accessible-treeview";

function DirectoryTreeView(props) {
  console.log(props.data);
  const data = flattenTree(props.data);

  const calculateIndentation = (level) => {
    const percentage = 5 * (level - 1);
    return `${percentage}%`;
  };

  const modifiedData = data.map((node) => ({
    ...node,
    defaultExpanded: true, // Set defaultExpanded to true for each node
  }));

  const [checkedNodes, setCheckedNodes] = useState([]);

  const handleCheckboxChange = (nodeId) => {
    if (checkedNodes.includes(nodeId)) {
      setCheckedNodes(checkedNodes.filter((node) => node !== nodeId));
    } else {
      setCheckedNodes([...checkedNodes, nodeId]);
    }
  };

  const isNodeChecked = (nodeId) => checkedNodes.includes(nodeId);

  const handleFolderOpen = (nodeId, isExpanded, children) => {
    if (isExpanded) {
      const childrenIds = children.map((child) => child.id);
      const newCheckedNodes = [...checkedNodes, ...childrenIds];
      setCheckedNodes(newCheckedNodes);
    } else {
      const descendants = getDescendants(nodeId);
      const newCheckedNodes = checkedNodes.filter((node) => !descendants.includes(node));
      setCheckedNodes(newCheckedNodes);
    }
  };

  const getDescendants = (nodeId) => {
    const node = data.find((item) => item.id === nodeId);
    if (!node) {
      return [];
    }
    const descendants = [nodeId];
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        const childDescendants = getDescendants(child.id);
        descendants.push(...childDescendants);
      });
    }
    return descendants;
  };

  return (
    <div className="">
      <div className="p-4 bg-white h-full font-mono text-base text-gray-800 select-none rounded-md">
        <TreeView
          data={modifiedData}
          aria-label="directory tree "
          nodeRenderer={({ element, isBranch, isExpanded, getNodeProps, level }) => (
            <div {...getNodeProps()} style={{ paddingLeft: calculateIndentation(level) }}>
              <label className="flex items-center cursor-pointer">
                {props.showCheckboxes && (
                  <input
                    type="checkbox"
                    className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                    onClick={(e) => e.stopPropagation()} // Stop event propagation
                    checked={isNodeChecked(element.id)}
                    onChange={() => handleCheckboxChange(element.id)}
                  />
                )}
                {isBranch ? (
                  <FolderIcon
                    isOpen={isExpanded}
                    onClick={() => {
                      getNodeProps({ nodeId: element.id, isExpanded: !isExpanded });
                      handleFolderOpen(element.id, isExpanded, element.children);
                    }}
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
