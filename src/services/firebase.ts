import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { getFirestore, initializeFirestore, doc, getDoc, setDoc, updateDoc, collection, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '@/firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, { experimentalForceLongPolling: true }, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/youtube.force-ssl'); // Required for managing YouTube posts

const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('pages_manage_posts');
facebookProvider.addScope('instagram_basic');
facebookProvider.addScope('instagram_content_publish');

export const firebaseService = {
  signInWithGoogle: () => signInWithPopup(auth, googleProvider),
  signInWithFacebook: () => signInWithPopup(auth, facebookProvider),
  signInWithEmail: (e: string, p: string) => signInWithEmailAndPassword(auth, e, p),
  signUpWithEmail: (e: string, p: string) => createUserWithEmailAndPassword(auth, e, p),
  signOut: () => signOut(auth),
  
  getUserProfile: async (uid: string) => {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  },

  createUserProfile: async (uid: string, email: string | null, displayName: string | null) => {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, {
      uid,
      email,
      displayName: displayName || email?.split('@')[0] || 'User',
      tier: 'free',
      syncedNodes: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  },

  saveAnalysis: async (type: string, title: string, data: any) => {
    const { currentUser } = auth;
    if (!currentUser) throw new Error('Auth required');
    
    const analysisRef = doc(collection(db, 'analysis'));
    await setDoc(analysisRef, {
      userId: currentUser.uid,
      type,
      title,
      status: 'Node Synced',
      resultData: data,
      timestamp: serverTimestamp()
    });
  },

  getQueue: (callback: (data: any[]) => void) => {
    const { currentUser } = auth;
    if (!currentUser) return () => {};
    
    const q = query(collection(db, 'queue'), where('userId', '==', currentUser.uid));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => {
      console.error("Queue Sync Error:", error);
    });
  }
};
