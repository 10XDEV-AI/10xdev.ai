import React, { useContext } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import SearchContext from './context/SearchContext';
import Sync from './Sync/Sync';
import ProjectInfo from './ProjectInfo/ProjectInfo';
import DropdownButton from './DropDownButton/DropDownButton';
import { Link } from 'react-router-dom';

function Navbar({file,onHamburgerClick}) {
  const navigate = useNavigate();
  const { isLoadingProjectInfo, repository, branch,commitHash } = useContext(SearchContext);
  return (
    <>
        {file==="chat"?
        <nav className="flex sticky top-0 text-blue-900 bg-slate-50 h-10 z-50">
            <div className="w-full flex">
                <button onClick={onHamburgerClick}>
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="text-blue-900 ml-1 px-1 w-10 h-8">
                     <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                   </svg>
                </button>
                <Link to="/welcome" className="my-auto">
                    <div className="italic font-bold text-xl">
                        10XDEV.AI
                    </div>
                </Link>
                <div className="my-auto mx-auto">
                    <Link to="/repos" className="">
                       <ProjectInfo isLoadingProjectInfo={isLoadingProjectInfo} repository={repository} branch={branch} />
                     </Link>
                </div>
                <button className="font-bold text-sm" onClick={onHamburgerClick}>
                    #{commitHash}
                </button>
                <div className="text-blue-900">
                  <DropdownButton />
                </div>
        </div>
    </nav>:
    <nav className="flex sticky top-0 bg-blue-900 h-10 z-50">
      <Link to="/welcome" className="my-auto">
          <div className="text-white text-4xl font-bold ml-1 italic">
              10XDEV.AI
          </div>
      </Link>
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