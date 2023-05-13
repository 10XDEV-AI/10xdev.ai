import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Train from "./Train";
import Repos from "./Repos";
import Welcome from "./Welcome";
import Chat from "./Chat";
import SearchState from "./context/SearchState";
import Apis from "./Apis/Apis";
import Clone from "./Clone";

function App () {
  return (
    <div className="App">
    <SearchState>
        <Router>
            <Routes>
                <Route path="/" element={<Welcome/>} />
                <Route path="/chat" element={<Chat/>} />
                <Route path="/train" element={<Train/>} />
                <Route path="/repos" element={<Repos/>} />
                <Route path="/apis" element={<Apis/>} />
                <Route path="/clone" element={<Clone/>} />
            </Routes>
        </Router>
    </SearchState>
    </div>
  );
}

export default App;