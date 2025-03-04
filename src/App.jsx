import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import EventCard from "./components/EventCard";

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
        <Link to="/">Home</Link> | <Link to="/events">Events</Link>
      </nav>
      </header>
      <main>
        <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/events" element={<Events />}/>
        </Routes>
      </main>
    </div>
    </BrowserRouter>
  );

}

export default App
