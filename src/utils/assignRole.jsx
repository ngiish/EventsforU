import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import {deleteField} from "firebase/firestore";

export async function assignRoleByEmail(eventId, email, role) {
  const userQuery = query(collection(db, "users"), where("email", "==", email));
  const snapshot = await getDocs(userQuery);

  if (!snapshot.empty) {
    throw new Error("User not found in the system.")
  }
  const userDoc = snapshot.docs[0];
    const userId = userDoc.id;

    const eventRef = doc(db, "events", eventId);

    const updateData = !role
        ? { [`collaborators.${userId}`]: deleteField() } // 🗑️ remove role
    : { [`collaborators.${userId}`]: role };         // ✅ assign/update role

    await updateDoc(eventRef, updateData);
  return { success: true, userId };
}

