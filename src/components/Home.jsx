import { useState, useEffect } from 'react';
import { db, auth } from '../firebase'; // Adjust path to your Firebase config
import { collection, addDoc, query, where, onSnapshot , doc, updateDoc, deleteDoc } from 'firebase/firestore';
import EventCard from './EventCard.jsx'; // Reuse your existing component
import '../Home.module.scss';
import DashboardShell from './DashboardShell';
import '../home-view.scss'; // NEW: Home-specific view styles (no color changes)

function Home() {
  const [event, setEvent] = useState({ title: '', date: '', time: '', location: '' });
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [newCollaboratorUid, setNewCollaboratorUid] = useState('');
  const [newRole, setNewRole] = useState('guest');
  const [errorMessage, setErrorMessage] = useState(null);//Forfeedback on errors

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
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const eventData = snapshot.docs.map((doc) => { 
            const data = doc.data();
            return {
              id: doc.id,
              title: data.title || 'Untitled',
              date: data.date || '',
              time: data.time || '',
              location: data.location || '',
              taskCount: data.taskCount || 0,
              completedTasks: data.completedTasks || 0,
              owner: data.userId === user.uid ? 'You' : data.owner || '—',
              status: data.status || 'Published',
              submissions: data.submissions || [],
              createdAt: data.createdAt || null,
              role: data.collaborators?.[user.uid] || '—',
            };
           });
          setEvents(eventData);
        },
        (error) => {
          console.error('Error fetching events:', error);
          setErrorMessage('Failed to load events. Please try again.')
        }
      );
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
        taskCount: 0,
        completedTasks: 0,
        status: 'Published',
        submissions: [],
      });
      console.log('Event created with ID:', eventRef.id);
      setEvent({ title: '', date: '', time: '', location: '' }); // Reset form
      setErrorMessage(null);
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
      setErrorMessage('Failed to assign role. Please try again.')
    }
  };

  //Delete Event
  const handleDelete = async (id) => {
    if (!id) {
      setErrorMessage('Event ID is missing. Cannot delete.');
      return;
    }
    try {
      await deleteDoc(doc(db, 'events', id));
      setEvents(events.filter((ev) => ev.id !== id)); //Update local state
      setErrorMessage(null); //Clear any previous errors
    } catch (error) {
      console.error('Error deleting event:', error);
      setErrorMessage('Failde to delete event. Please try again.');
    }
  };

  return (
    <DashboardShell
      title="Welcome to EventsForU"
      stats={[
        { value: events.length || 0, label: 'Events' },
        { value: 0, label: 'Applications' },
      ]}
    >
      {/*Error Message Display */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Create Event */}
      <div className="home-create">
        <h2 className="home-section-title">Create an Event</h2>
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
      </div>

      {/* Your Events */}
      <div className="home-events">
        <h2 className="sr-only">My Events</h2>

        {/* Table header to resemble the screenshot */}
        <div className="table table--header">
          <div className="th">Event</div>
          <div className="th">Owner</div>
          <div className="th">Status</div>
          <div className="th">Submissions</div>
          <div className="th">Created</div>
          <div className="th">Your Role</div>
        </div>

        {events.length > 0 ? (
          events.map((ev) => (
            <div key={ev.id} className="table table--row">
              <div className="td">
                <EventCard title={ev.title} date={ev.date} />
                <div className="event__meta">
                  {ev.time ? `Time: ${ev.time}` : null}
                  {ev.location ? ` • ${ev.location}` : null}
                </div>

                {/* Assignment controls (functionality unchanged) */}
                <div className="assign-controls">
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select Event</option>
                    {events.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.title}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={newCollaboratorUid}
                    onChange={(e) => setNewCollaboratorUid(e.target.value)}
                    placeholder="Enter UID"
                    className="input-field"
                  />

                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="input-field"
                  >
                    <option value="guest">Guest</option>
                    <option value="vendor">Vendor</option>
                    <option value="co_organizer">Co-Organizer</option>
                    <option value="admin">Admin</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => assignRole(selectedEventId, newCollaboratorUid, newRole)}
                    className="submit-btn"
                  >
                    Assign Role
                  </button>
                </div>
              </div>

              {/* Visual columns to match screenshot; values read from your data */}
              <div className="td">{ev.owner || '—'}</div>
              <div className="td"><span className="badge">{ev.status || 'Published'}</span></div>
              <div className="td">
                <div className="tile"><strong>{(ev.submissions && ev.submissions.length) || 0}</strong></div>
              </div>
              <div className="td">
                {ev.createdAt
                  ? new Date(ev.createdAt.seconds ? ev.createdAt.seconds * 1000 : ev.createdAt).toLocaleDateString()
                  : '—'}
              </div>
              <div className="td">{ev.role || '—'}</div>
            </div>

            /*Actions */
                        

          ))
        ) : (
          <p className="home-empty">No events yet.</p>
        )}
      </div>
    </DashboardShell>
  );
}

export default Home;
