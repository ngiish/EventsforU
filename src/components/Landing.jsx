import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Event1 from '../assets/eventsimg1.jpg';
import Event2 from '../assets/eventsimg2.jpg';
import Event3 from '../assets/eventsimg3.jpg';
import Event4 from '../assets/eventsimg4.jpg';
import Event5 from '../assets/eventsimg5.jpg';
import Event6 from '../assets/eventsimg6.jpg';
import '../Landing.scss';

function Landing() {
  const images = [Event1, Event2, Event3, Event4, Event5, Event6];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="landing">
      {/* Smooth Scroll Behavior */}
      <header className='navbar'>
        <div className='logo'>
          <a href="#home"></a>
        </div>
        <nav>
          <a href="#features">Features</a>
          <a href="#story">Our Story</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero">
        <img
          src={images[currentImageIndex]}
          alt={`Event Slide ${currentImageIndex + 1}`}
          className="hero-image"
        />
        <div className="hero-text">
          <h2>Plan Smarter. Together.</h2>
          <p>Organise, delegate and streamline your events like never before.</p>
          <div className="cta-buttons">
            <Link to="/signup" className="primary-btn">Get Started</Link>
            <Link to="/login" className="secondary-btn">Log In</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2>Platform Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Collaborator Roles</h3>
            <p>Assign event roles like vendors, guests, and co-organizers.</p>
          </div>
          <div className="feature-card">
            <h3>Live Event Updates</h3>
            <p>Manage real-time task assignments and progress updates.</p>
          </div>
          <div className="feature-card">
            <h3>Centralized Dashboard</h3>
            <p>Keep everything in one place for quick and easy access.</p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="story" className="story-section">
        <h2>Our Story</h2>
        <p>
          EventsForU was born out of a desire to make event planning stress-free, collaborative,
          and efficient — whether you're organizing a wedding, conference, or community event.
        </p>
      </section>
    </div>
  );
}

export default Landing;
