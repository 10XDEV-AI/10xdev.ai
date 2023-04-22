import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Welcome from "./Welcome";
import Chat from "./Chat";
import SearchState from "./context/SearchState";

function App () {
  return (
    <div className="App">
    <SearchState>
        <Router>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/chat" element={<Chat />} />
            </Routes>
        </Router>
    </SearchState>
    </div>
  );
}

export default App;