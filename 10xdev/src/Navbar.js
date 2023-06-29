import React from 'react';
import './Navbar.css';
import Sync from './Sync/Sync';
import ProjectInfo from './ProjectInfo/ProjectInfo';
import DropdownButton from './DropDownButton/DropDownButton';
import { Link } from 'react-router-dom';

function Navbar({LoadProjectInfo,file}) {
  return (
    <>
    {file==="chat"? <nav className="flex sticky top-0 text-blue-900 h-10 z-50">

<button className="">
<Link to="/welcome">
   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="text-blue-900 ml-1 px-1 w-10 h-8">
     <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
   </svg>

</Link>
</button>

<div className="navbar-projectInfo">

</div>
<div className="linkscontainer">
<div className="text-blue-900 linkColumn">
  <DropdownButton />
</div>
</div>
</nav>:
    <nav className="flex sticky top-0 bg-blue-900 h-10 z-50">

      <button className="">
      <Link to="/welcome">
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="text-white ml-1 px-1 w-10 h-8">
           <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
         </svg>

     </Link>
     </button>
      <div className="text-white text-4xl font-bold ml-1 italic">
        <Link to="/welcome">
          10XDEV.AI
        </Link>
      </div>
      <div className="navbar-projectInfo">

      </div>
      <div className="linkscontainer">
      <div className="text-white linkColumn">
        <DropdownButton />
      </div>
      </div>
    </nav>
    }
    </>
  );
}

export default Navbar;