import React,{ useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Train from "./Train";
import Repos from "./Repos";
import Welcome from "./Welcome";
import PublicRouter from "./OpenSource/PublicRouter";
import PublicChat from "./OpenSource/PublicChat";
import Chat from "./Chat";
import SearchState from "./context/SearchState";
import Apis from "./Apis/Apis";
import Branch from "./Branch/Branch";
import Clone from "./Clone";
import LoadingRing from "./OpenSource/Loader/Loader"
import LandingPage from "./landing page/landing";
import NewWelcome from "./NewWelcome";
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
                <Route path="/test" element={<LoadingRing/>} />
                <Route path="/opensource/:projectName" element={<PublicRouter/>} />
                <Route path="/opensource/:projectName/chat" element={<PublicChat/>} />
            </Routes>
        </Router>
    </SearchState>
    </div>
  );
}

export default App;
