import './Welcome.css';
import SearchBar0 from './SearchBar0/SearchBar0';
import { useNavigate } from 'react-router-dom';
import { Typewriter } from 'react-simple-typewriter'
import ProjectInfo from './ProjectInfo/ProjectInfo';

function Welcome() {
    const navigate = useNavigate();

    const handleSearch = (searchInput) => {
        navigate('/chat', { state: { searchInput } });
    }
;


    return (
        <div className="container">
            <div className="container">
                <div className="logoContainer">
                <Typewriter {
                    ...{
                        words: ['10XDEV.AI'],
                        loop: 1,
                        cursor: true,
                        cursorStyle: '_',
                        delay: 100,
                        deleteSpeed: 50,
                        typeSpeed: 100,
                        style: { fontSize: '50px', fontWeight: 'bold' },
                     }
                } />
                    {/* 10XDEV.AI */}
                </div>
                <div className="subText">
                    Ask an AI to implement new features in your app!
                </div>
                <div className="welcomesearchrow">
                    <SearchBar0 onSearch={handleSearch} />
                </div>
                <div className="projectinfo">
                    <ProjectInfo/>
                </div>

                <div className="bottomText">

                </div>
            </div>
        </div>
    );
}

export default Welcome;