const firebaseConfig = {
apiKey: "AIzaSyDbjlgdS3mspldvDMJus9LrNI_6gItemBE",

  authDomain: "swat-e2aa8.firebaseapp.com",

  projectId: "swat-e2aa8",

  storageBucket: "swat-e2aa8.firebasestorage.app",

  messagingSenderId: "504240588895",

  appId: "1:504240588895:web:4fa1aab70b57e65cae73ea",

  measurementId: "G-1Y3Q37S9L1"

};



firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
