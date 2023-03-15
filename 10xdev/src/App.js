import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './components/Chat';
import Welcome from './components/Welcome';
import Train from './components/Train';

function App() {
  return (
    <Router>
      <div className="Appcontainer">
        <Routes>
          <Route exact path="/" element={<Chat />} />
          <Route exact path="/welcome" element={<Welcome />} />
          <Route exact path="/train" element={<Train />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
