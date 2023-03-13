import Menubar from './Menubar';
import CodeTab from './CodeTab';
import NextButtons from './NextButtons';
import './Main.css';
import SearchBar from './SearchBar/SearchBar';
import Navbar from './Navbar';

function Main() {
  return (
  <div className="container">
    <Navbar/>
    <div className="row1">
        <CodeTab/>
    </div>
    <div className="searchbarrow">
        <SearchBar/>
    </div>
  </div>
  );
}

export default Main;