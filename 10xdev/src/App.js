import React from "react";
import { useEffect } from "react";
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
import  User from "./User";
import Cookies from 'js-cookie';

function App () {
    useEffect(() => {
        // Extract the code from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
          // Store the code in an HTTP-only cookie
          Cookies.set('cognitoCode', code, { path: '/', secure: true, sameSite: 'strict' });

          // Remove the code from the URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }, []);

  return (
    <div className="App">
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
                <Route path="/branch" element={<Branch/>} />
                <Route path="/test" element={<User/>} />
            </Routes>
        </Router>
    </SearchState>
    </div>
  );
}

export default App;