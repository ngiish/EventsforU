import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Landing from "./components/Landing";
import EventCard from "./components/EventCard";
import Auth from "./components/Auth";
import './App.scss';

function Home() {
  return <h2>Home Page</h2>;

}
function Events() {
  const events = [
    {title: "Birthday Party", date:"March 10, 2025"},
    {title: "Wedding", date:"April 15, 2025"},
    {title: "Conference", date:"May 20, 2025"},
  ];
  return (
    <>
    <h2>Events Page</h2>
    {events.map((event, index) => (
      <EventCard key={index} title={event.title} date={event.date}/>
      ))}
    
    </>
  );
}

function App() {

  return (
    <BrowserRouter>
    <div className="app">
      <header>
      <h1>Event Planner</h1>
      <nav>
        <Link to="/">Home</Link> | <Link to="/events">Events</Link> |
        <Link to="/signup">Sign Up</Link> | <Link to="/login">Log In</Link>
      </nav>
      </header>
      <main>
        <Routes>
        <Route path="/" element={<Landing />}/>
        <Route path="/events" element={<Events />}/>
        <Route path="/signup" element={<Auth isSignUp={true} />}/>
        <Route path="/login" element={<Auth isSignUp={false} />}/>
        </Routes>
      </main>

      <Auth />
    </div>
    </BrowserRouter>
  );

}

export default App
