import React from 'react';
import './Menubar.css';

function Menubar() {
  return (
  <div className="menubarcontainer">
    <div className="row">
            On Branch UBERUI2011
    </div>
    <div className="row">
        <div className="col1">
            <div className = "NewFile">
                Create New File? :
            </div >
        </div>
        <div className="col2">
          <input className="textinput" type="text" name="filename" />
        </div>
        <div className="col3">
          <input className="checkbox" type="checkbox" name="createfile" />
        </div>
    </div>
  </div>
  );
}

export default Menubar;
