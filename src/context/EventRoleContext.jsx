// src/context/EventRoleContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const EventRoleContext = createContext();

export const useEventRole = () => useContext(EventRoleContext);

export const EventRoleProvider = ({ eventId, userId, children }) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      const eventRef = doc(db, "events", eventId);
      const eventSnap = await getDoc(eventRef);

      if (eventSnap.exists()) {
        const collaborators = eventSnap.data().collaborators || {};
        setRole(collaborators[userId] || null);
      }
    };

    if (eventId && userId) fetchRole();
  }, [eventId, userId]);

  return (
    <EventRoleContext.Provider value={role}>
      {children}
    </EventRoleContext.Provider>
  );
};
