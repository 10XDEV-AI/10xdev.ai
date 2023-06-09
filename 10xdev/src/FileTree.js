
import React from 'react'
import { Treebeard } from 'react-treebeard';
const FileTree = (props) => {
  return (
    <div>
        <Treebeard data={props.data} />
    </div>
  )
}

export default FileTree;