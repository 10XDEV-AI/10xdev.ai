import React,{ useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Train from "./Train";
import Repos from "./Repos";
import Welcome from "./Welcome";
import Chat from "./Chat";
import SearchState from "./context/SearchState";
import Apis from "./Apis/Apis";
import Branch from "./Branch/Branch";
import Clone from "./Clone";
import LoadingRing from "./Loader/Loader";
import LandingPage from "./landing page/landing";
import LeftWelcome from "./LeftWelcome";
import NewWelcome from "./NewWelcome";
import User from "./User";
import CreateProject from "./CreateProject";
import Create from "./Create";

function App () {
  
  return (
    <div className="App">
    <div id="alert-container"></div>
    <SearchState>
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage/>} />
                <Route path="/welcome" element={<Welcome/>} />
                <Route path="/chat" element={<Chat/>} />
                <Route path="/train" element={<Train/>} />
                <Route path="/repos" element={<Repos/>} />
                <Route path="/apis" element={<Apis/>} />
                <Route path="/clone" element={<Clone/>} />
                <Route path="/logs" element={<LoadingRing/>} />
                <Route path="/create" element={<Create/>} />
                <Route path="/clarify" element={<CreateProject/>} />
                <Route path="/branch" element={<Branch/>} />
                <Route path="/test" element={
                <NewWelcome/>
                } />
            </Routes>
        </Router>
    </SearchState>
    </div>
  );
}

export default App;