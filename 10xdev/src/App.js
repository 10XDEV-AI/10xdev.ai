import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './components/Chat';
import Welcome from './components/Welcome';
import Setup from './components/Setup/Setup';

function App() {
  return (
    <Router>
      <div className="Appcontainer">
        <Routes>
          <Route exact path="/" element={<Welcome />} />
          <Route exact path="/chat" element={<Chat />} />
          <Route exact path="/setupNewRepo" element={<Setup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
