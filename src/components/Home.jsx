import { useState, useEffect } from 'react';
import { db, auth } from '../firebase'; // Adjust path to your Firebase config
import { collection, addDoc, query, where, onSnapshot , doc, updateDoc} from 'firebase/firestore';
import EventCard from './EventCard.jsx'; // Reuse your existing component
import '../Home.module.scss';

function Home() {
  const [event, setEvent] = useState({ title: '', date: '', time: '', location: '' });
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [newCollaboratorUid, setNewCollaboratorUid] = useState('');
  const [newRole, setNewRole] = useState('guest');

  // Fetch events
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
    if (user) {
      const token = await user.getIdTokenResult();
      console.log('User claims:', token.claims); // Look for role: 'admin'
    }
  });
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, 'events'), where(`collaborators.${user.uid}`, '!=', null));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const eventData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setEvents(eventData);
      }, (error) => {
        console.error('Error fetching events:', error);
      });
      return () => unsubscribe();
    }
    return () => unsubscribeAuth && unsubscribeAuth();
  }, []);

  // Create event
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (user) {
      const eventRef = await addDoc(collection(db, 'events'), {
        ...event,
        userId: user.uid,
        collaborators: {
          [user.uid]: 'admin', // Setting the creator as the admin
        },
        createdAt: new Date(),
      });
      console.log('Event created with ID:', eventRef.id);
      setEvent({ title: '', date: '', time: '', location: '' }); // Reset form
    }
  };

  // Assign role to a collaborator
  const assignRole = async (eventId, collaboratorUid, role) => {
    const eventRef = doc(db, 'events', eventId);
    try {
      await updateDoc(eventRef, {
        collaborators: {
          [collaboratorUid]: role,
        },
      });
      console.log(`Assigned ${role} role to ${collaboratorUid} in event ${eventId}`);
    } catch (error) {
      console.error('Error assigning role:', error);
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
          <div key={event.id}>
            <EventCard title={event.title} date={event.date} />
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
            >
              <option value="">Select Event</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
            <input
              type="text"
              value={newCollaboratorUid}
              onChange={(e) => setNewCollaboratorUid(e.target.value)}
              placeholder="Enter UID"
            />
            <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
              <option value="guest">Guest</option>
              <option value="vendor">Vendor</option>
              <option value="co_organizer">Co-Organizer</option>
              <option value="admin">Admin</option>
            </select>
            <button onClick={() => assignRole(selectedEventId, newCollaboratorUid, newRole)}>Assign Role</button>
          </div>
        ))
      ) : (
        <p>No events yet.</p>
      )}
    </div>
  );
}

export default Home;