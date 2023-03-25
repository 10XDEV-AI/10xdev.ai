import './Welcome.css';
import SearchBar0 from './SearchBar0/SearchBar0';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Welcome() {
    const navigate = useNavigate();
    const [repository, setRepository] = useState('');
    const [branch, setBranch] = useState('');

    const handleSearch = (searchInput) => {
        navigate('/chat', { state: { searchInput } });
    }

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://127.0.0.1:5000/api/projectInfo?');
            const data = await response.json();
            setRepository(data.repository);
            setBranch(data.branch);
            console.log('Updated repository:', data.repository);
            console.log('Updated branch:', data.branch);
        }

        const interval = setInterval(() => {
            fetchData();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container">
            <div className="container">
                <div className="logoContainer">
                    10XDEV.AI
                </div>
                <div className="subText">
                    Ask an AI to implement new features in your app!
                </div>
                <div className="welcomesearchrow">
                    <SearchBar0 onSearch={handleSearch} />
                </div>
                <div className="projectinfo">
                    On Branch  : {branch} |
                    In Repository  : {repository}
                </div>
                <div className="bottomText">

                </div>
            </div>
        </div>
    );
}

export default Welcome;