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
          aria-label="directory tree"
          nodeRenderer={({ element, isBranch, isExpanded, getNodeProps, level }) => (
            <div {...getNodeProps()} style={{ paddingLeft: calculateIndentation(level) }}>
              {isBranch ? <FolderIcon isOpen={isExpanded} /> : <FileIcon filename={element.name} />}
              {element.name}
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
      return <DiJavascript color="yellow" className="inline-block align-middle mr-1" />;
    case "css":
      return <DiCss3 color="turquoise" className="inline-block align-middle mr-1" />;
    case "json":
      return <FaList color="turquoise" className="inline-block align-middle mr-1" />;
    case "npmignore":
      return <DiNpm color="red" className="inline-block align-middle mr-1" />;
    case "jsx":
      return <BsFiletypeJsx color="blue" className="inline-block align-middle mr-1" />;
    case "scss":
      return <BsFiletypeScss color="green" className="inline-block align-middle mr-1" />;
    case "py":
      return <FaPython color="cyan" className="inline-block align-middle mr-1" />;
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
