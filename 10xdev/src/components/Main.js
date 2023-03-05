import Menubar from './Menubar';
import CodeTab from './CodeTab';
import NextButtons from './NextButtons';
import './Main.css';
function Main() {
  return (
  <div className="container">
    <div className="row1">
        <div className="Menubar">
            <Menubar/>
        </div>
        <div className="CodeTab">
              <CodeTab/>
        </div>
    </div>
    <div className="row2">
    <div className="NextButtons">
                <NextButtons/>
    </div>
    </div>
  </div>
  );
}

export default Main;