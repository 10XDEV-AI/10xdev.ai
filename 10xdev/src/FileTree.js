import React from "react";
import { DiJavascript, DiCss3, DiNpm } from "react-icons/di";
import { FaList, FaPython, FaReadme ,FaRegFolderOpen,FaRegFolder} from "react-icons/fa";
import { BsFiletypeJsx, BsFiletypeScss } from "react-icons/bs";
import { RiFileCodeLine } from "react-icons/ri"; // Example of using a different react-icons package
import TreeView, { flattenTree } from "react-accessible-treeview";
import "./FileTree.css";


function DirectoryTreeView(props) {
  console.log(props.data);
  const data = flattenTree(props.data);
  return (
    <div>
      <div className="directory">
        <TreeView
          data={data}
          aria-label="directory tree"
          nodeRenderer={({
            element,
            isBranch,
            isExpanded,
            getNodeProps,
            level,
          }) => (
            <div {...getNodeProps()} style={{ paddingLeft: 20 * (level - 1) }}>
              {isBranch ? (
                <FolderIcon isOpen={isExpanded} />
              ) : (
                <FileIcon filename={element.name} />
              )}

              {element.name}
            </div>
          )}
        />
      </div>
    </div>
  );
}

const FolderIcon = ({ isOpen }) =>
  isOpen ? (
    <FaRegFolderOpen color="e8a87c" className="icon" />
  ) : (
    <FaRegFolder color="e8a87c" className="icon" />
  );

const FileIcon = ({ filename }) => {
  const extension = filename.slice(filename.lastIndexOf(".") + 1);
  switch (extension) {
    case "js":
      return <DiJavascript color="yellow" className="icon" />;
    case "css":
      return <DiCss3 color="turquoise" className="icon" />;
    case "json":
      return <FaList color="yellow" className="icon" />;
    case "npmignore":
      return <DiNpm color="red" className="icon" />;
    case "jsx":
      return <BsFiletypeJsx color="blue" className="icon" />;
    case "scss":
      return <BsFiletypeScss color="green" className="icon" />;
    case "py":
      return <FaPython color="cyan" className="icon" />;
    case "md":
      return <FaReadme color="black" className="icon" />;
    case "ts":
        return <RiFileCodeLine color="teal" className="icon" />;
    case "yml":
        return <RiFileCodeLine color="purple" className="icon" />;
    default:
      return null;
  }
};

export default DirectoryTreeView;