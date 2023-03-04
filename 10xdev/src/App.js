import Navbar from './components/Navbar';
import EdittableTable from './components/EdittableTable';
import './App.css';
import Tabs from "./components/Tabs";

function App() {
  return (
    <div>
        <Navbar/>
        <Tabs>
                <div label="index.html">
                  <EdittableTable/>
                </div>
                <div label="login.js">
                 <EdittableTable/>
                </div>
                <div label="styles.css">
                  <EdittableTable/>
                </div>
        </Tabs>
    </div>
    );
}

export default App;
