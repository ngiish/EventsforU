import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Event1 from '../assets/eventsimg1.jpg';
import Event2 from '../assets/eventsimg2.jpg';
import Event3 from '../assets/eventsimg3.jpg';
import Event4 from '../assets/eventsimg4.jpg';
import Event5 from '../assets/eventsimg5.jpg';
import Event6 from '../assets/eventsimg6.jpg';
import '../Landing.scss';

function Landing() {
    // Array of imported images
    const images = [Event1, Event2, Event3, Event4, Event5, Event6];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Slideshow effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000); // Slide every 5 seconds (adjust as needed)

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="landing">
        <section className="hero">
          <img
            src={images[currentImageIndex]}
            alt={`Event Slide ${currentImageIndex + 1}`}
            className="hero-image"
          />
          <div className="hero-text">
            <h2>Plan, Manage, Celebrate</h2>
            <p>Create unforgettable events with ease.</p>
          </div>
        </section>
      </div>
    );
  }
export default Landing;