import React,{useState} from 'react'
import { Treebeard } from 'react-treebeard';
const FileTree = (props) => {
  const customStyle = {
    tree: {
      base: {
        backgroundColor: 'white',
        color: 'blue',
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
      },
      node: {
        base: {
          paddingLeft: '20px',
        },
        link: {
          color: 'blue',
          textDecoration: 'none',
        },
        activeLink: {
          background: 'lightgray',
        },
      },
    },
  };
  const [cursor, setCursor] = useState(false);
    
    const onToggle = (node, toggled) => {
        if (cursor) {
            cursor.active = false;
        }
        node.active = true;
        if (node.children) {
            node.toggled = toggled;
        }
        setCursor(node);
    }
  

  
  return (
    <div >
        <Treebeard  data={props.data} style={customStyle} onToggle={onToggle} />
    </div>
  )
}

export default FileTree;
