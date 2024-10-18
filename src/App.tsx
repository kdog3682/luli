
import React, { useState, useEffect, useRef } from 'react';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  setPersistence,
  browserLocalPersistence 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from 'firebase/app';

console.log(import.meta.env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_LULI_FIREBASE_API_KEY,
  authDomain: "luli-85342.firebaseapp.com",
  projectId: "luli-85342",
  storageBucket: "luli-85342.appspot.com",
  messagingSenderId: "973933192887",
  appId: "1:973933192887:web:af87e89b1d52692797cf32",
  measurementId: "G-MVKZGVS3B9"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence);

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: '#4285f4',
    color: 'white',
  },
  textarea: {
    width: '100%',
    minHeight: '100px',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  note: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  timestamp: {
    fontSize: '12px',
    color: '#666',
    marginTop: '5px',
  },
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
  },
};

export default function App() {
  const [user, setUser] = useState(null);
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const textareaRef = useRef(null)


  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      if (user) {
        // Create query for user's notes, ordered by server timestamp
        const q = query(
          collection(db, 'notes'),
          orderBy('timestamp', 'desc')
        );

        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const notesList = snapshot.docs
            .filter(doc => doc.data().userId === user.uid)
            .map(doc => ({
              id: doc.id,
              ...doc.data(),
              // Ensure timestamp exists before trying to use it
              timestamp: doc.data().timestamp?.toDate() || new Date()
            }));
          setNotes(notesList);
        });

        return () => unsubscribeSnapshot();
      }
    });

    return () => unsubscribeAuth();
  }, []);
      useEffect(() => {
    // Focus the textarea on component mount
    setTimeout(() => textareaRef.current.focus(), 15)
  }, [])

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setNotes([]);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNoteSubmit = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey && note.trim()) {
      e.preventDefault();
      try {
        await addDoc(collection(db, 'notes'), {
          text: note.trim(),
          timestamp: serverTimestamp(), // Using server timestamp
          userId: user.uid
        });
        setNote('');
      } catch (error) {
        console.error('Error adding note:', error);
      }
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        Checking authentication...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.loginContainer}>
        <button style={styles.button} onClick={handleSignIn}>
          Sign in with your Google Account
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Notes</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>{user.email}</span>
          <button style={styles.button} onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>

      <textarea
        style={styles.textarea}
        spellCheck="false" autoCorrect="off" autoComplete="off"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        ref={textareaRef}
        onKeyDown={handleNoteSubmit}
        placeholder="Type your note and press Enter to save..."
      />

      <div>
        {notes.map((note) => (
          <div key={note.id} style={styles.note}>
            <div style={{ whiteSpace: 'pre-wrap' }}>{note.text}</div>
            <div style={styles.timestamp}>
              {note.timestamp.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
