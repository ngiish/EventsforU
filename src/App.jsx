import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Landing from "./components/Landing";
import EventCard from "./components/EventCard";
import Auth from "./components/Auth";
import './App.scss';
import Home from "./components/Home";
import { useEffect, useState } from "react";
import {auth} from "./firebase";


function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged ((currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, [])

  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <h1><Link to="/" className="logo">EventsForU</Link></h1>
          <div className="nav-buttons">
            {user ? (
              <>
                <Link to="/home" className="nav-btn">Home</Link>
                <Link to="/" onClick={() => auth.signOut()} className="nav-btn">Log Out</Link>
              </>
            ) : (
              <>
                <Link to="/signup" className="nav-btn">Sign Up</Link>
                <Link to="/login" className="nav-btn">Log In</Link>
              </>
            )}
          </div>
        </nav>
        <main>
          {authChecked && (
          <Routes>
            <Route path="/" element={user ? <Navigate to="/home" /> : <Landing />} />
            <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
            <Route path="/signup" element={<Auth isSignUp={true} />} />
            <Route path="/login" element={<Auth isSignUp={false} />} />
          </Routes>
          )}
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App 
