<!-- //Setting up admin-scripts -->
1. Initializing the script
Creation of the setAdminRole.cjs script file using the nano editor:

nano setAdminRole.cjs

This opens the Nano editor to create a file named setAdminRole.cjs.

🔹 In Nano, paste your script code (we’ll provide that below)
🔹 Save and exit:

Press Ctrl + O → then Enter (to save)

Press Ctrl + X (to exit)


2. Initialize a Node.js Project (creates package.json)

npm init -y

This generates a package.json file with default settings.


3. Install Firebase Admin SDK

npm install firebase-admin

This installs the Admin SDK that lets your script access Firestore securely.


4. Set Up Firebase Admin SDK

Generate Service Account Key
Go to: https://console.firebase.google.com/

Select your project → Click Settings → Project Settings

Click the “Service Accounts” tab

Click “Generate new private key”

Save the downloaded file as: 

serviceAccountKey.json

Move it into the same folder as admin-scripts

5. Import the key in the script

// Import the Firebase Admin SDK to access Firestore securely from the backend
const admin = require("firebase-admin");

// Load the service account credentials from the JSON key file
// This file was downloaded from the Firebase Console and grants admin privileges
const serviceAccount = require("./serviceAccountKey.json");

// Initialize the Firebase Admin app using the service account
// This connects your script to the correct Firebase project with full privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Initialize Firestore database reference from the admin app
const db = admin.firestore();

// Set the ID of the event document you want to update in Firestore
// You can find this ID in the Firestore database under the "events" collection
const eventId = "your-event-id";

// Set the UID of the user you want to promote to admin
// You can find this UID in Firebase Authentication or your Firestore "users" collection
const userId = "user-uid-to-promote";

// Define an asynchronous function that performs the role assignment
async function setAdminRole() {
  try {
    // Reference the event document you want to update
    const eventRef = db.collection("events").doc(eventId);

    // Update the 'collaborators' map inside the event document
    // Set the user's role to "admin" by dynamically inserting their UID as the key
    await eventRef.update({
      [`collaborators.${userId}`]: "admin",
    });

    // Log success message in the terminal
    console.log(`✅ ${userId} set as admin for event ${eventId}`);
  } catch (err) {
    // Catch and display any errors (e.g., document not found, permission error)
    console.error("❌ Error:", err.message);
  }
}

// Run the function to perform the update
setAdminRole();


6. Run the script

node setAdminRole.cjs

