import React from "react";
import { DiJavascript, DiCss3, DiNpm } from "react-icons/di";
import { FaList, FaPython, FaReadme, FaRegFolderOpen, FaRegFolder } from "react-icons/fa";
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

  return (
    <div className="">
      <div className="p-4 bg-white h-full font-mono text-base text-gray-800 select-none rounded-md">
        <TreeView
          data={modifiedData}
          aria-label="directory tree "
          nodeRenderer={({ element, isBranch, isExpanded, getNodeProps, level }) => (
            <div {...getNodeProps()} style={{ paddingLeft: calculateIndentation(level) }}>
              <label className="flex items-center cursor-pointer" onClick={() => console.log(element.name)}>
                <input type="checkbox" onChange={(e) => console.log(e.target.checked)}  className="m-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"/>
                {isBranch ? <FolderIcon isOpen={isExpanded} /> : <FileIcon filename={element.name} />}
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
  isOpen ? <FaRegFolderOpen color="e8a87c" className="inline-block align-middle mr-1" /> : <FaRegFolder color="e8a87c" className="inline-block align-middle mr-1" />;

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
