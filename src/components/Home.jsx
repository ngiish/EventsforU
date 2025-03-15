import { useState, useEffect } from 'react';
import { db, auth } from '../firebase'; // Adjust path to your Firebase config
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import EventCard from './EventCard'; // Reuse your existing component

function Home() {
  const [event, setEvent] = useState({ title: '', date: '', time: '', location: '' });
  const [events, setEvents] = useState([]);

  // Fetch events
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, 'events'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const eventData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setEvents(eventData);
      });
      return () => unsubscribe();
    }
  }, []);

  // Create event
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', event);
    const user = auth.currentUser;
    if (user) {
      try {
        await addDoc(collection(db, 'events'), {
          ...event,
          userId: user.uid,
          createdAt: new Date(),
        });
        setEvent({ title: '', date: '', time: '', location: '' });
      } catch (error) {
        console.error('Error creating event:', error);
      }
    }
  };

  return (
    <div>
      <h2>Create an Event</h2>
      <form onSubmit={handleSubmit} className="event-form">
        <input
          type="text"
          value={event.title}
          onChange={(e) => setEvent({ ...event, title: e.target.value })}
          placeholder="Event Title"
          className="input-field"
        />
        <input
          type="date"
          value={event.date}
          onChange={(e) => setEvent({ ...event, date: e.target.value })}
          className="input-field"
        />
        <input
          type="time"
          value={event.time}
          onChange={(e) => setEvent({ ...event, time: e.target.value })}
          className="input-field"
        />
        <input
          type="text"
          value={event.location}
          onChange={(e) => setEvent({ ...event, location: e.target.value })}
          placeholder="Location"
          className="input-field"
        />
        <button type="submit" className="submit-btn">Add Event</button>
      </form>

      <h2>My Events</h2>
      {events.length > 0 ? (
        events.map((event) => (
          <EventCard key={event.id} title={event.title} date={event.date} />
        ))
      ) : (
        <p>No events yet.</p>
      )}
    </div>
  );
}

export default Home;