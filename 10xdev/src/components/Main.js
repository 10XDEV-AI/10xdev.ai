import Menubar from './Menubar';
import CodeTab from './CodeTab';

function Main() {
  return (
    <div className="container">
        <div className="Menubar">
            <Menubar/>
        </div>
        <div className="CodeTab">
              <CodeTab/>
        </div>
    </div>
  );
}

export default Main;