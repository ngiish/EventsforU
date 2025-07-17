const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // 🔁 Update path if needed

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// === Replace these ===
const eventId = "your-event-id";        // <-- Replace with actual event ID
const userId = "user-uid-to-promote";   // <-- Replace with the user's UID

async function setAdminRole() {
  try {
    const eventRef = db.collection("events").doc(eventId);
    await eventRef.update({
      [`collaborators.${userId}`]: "admin",
    });
    console.log(`✅ ${userId} set as admin for event ${eventId}`);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

setAdminRole();

