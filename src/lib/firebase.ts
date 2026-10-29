import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Check if valid Firebase configuration is present
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey.length > 5 &&
  firebaseConfig.projectId
);

const app = isFirebaseConfigured
  ? (!getApps().length ? initializeApp(firebaseConfig) : getApp())
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

// Auth Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

// Google Sign In
export async function signInWithGoogle(): Promise<{ user?: User; error?: string }> {
  if (!auth) {
    return {
      error: 'Firebase Authentication is not configured yet. Please configure VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID in your environment variables.',
    };
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user };
  } catch (err: any) {
    console.error('Google Sign-In Error:', err);
    return { error: err?.message || 'Google Sign-In failed.' };
  }
}

// Facebook Sign In
export async function signInWithFacebook(): Promise<{ user?: User; error?: string }> {
  if (!auth) {
    return {
      error: 'Firebase Authentication is not configured yet. Please configure VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID in your environment variables.',
    };
  }
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    return { user: result.user };
  } catch (err: any) {
    console.error('Facebook Sign-In Error:', err);
    return { error: err?.message || 'Facebook Sign-In failed.' };
  }
}

// Apple Sign In
export async function signInWithApple(): Promise<{ user?: User; error?: string }> {
  if (!auth) {
    return {
      error: 'Firebase Authentication is not configured yet. Please configure VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID in your environment variables.',
    };
  }
  try {
    const result = await signInWithPopup(auth, appleProvider);
    return { user: result.user };
  } catch (err: any) {
    console.error('Apple Sign-In Error:', err);
    return { error: err?.message || 'Apple Sign-In failed.' };
  }
}

// Email & Password Sign In
export async function signInWithEmail(email: string, pass: string): Promise<{ user?: User; error?: string }> {
  if (!auth) {
    return {
      error: 'Firebase Authentication is not configured yet. Please configure VITE_FIREBASE_API_KEY in your environment variables.',
    };
  }
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return { user: result.user };
  } catch (err: any) {
    return { error: err?.message || 'Email Sign-In failed.' };
  }
}

// Email & Password Registration
export async function signUpWithEmail(email: string, pass: string, displayName?: string): Promise<{ user?: User; error?: string }> {
  if (!auth) {
    return {
      error: 'Firebase Authentication is not configured yet. Please configure VITE_FIREBASE_API_KEY in your environment variables.',
    };
  }
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    if (result.user && displayName?.trim()) {
      try {
        await updateProfile(result.user, { displayName: displayName.trim() });
      } catch {
        // ignore name update error
      }
    }
    return { user: result.user };
  } catch (err: any) {
    return { error: err?.message || 'Email Registration failed.' };
  }
}

// Sign Out
export async function signOutUser(): Promise<void> {
  if (auth) {
    await signOut(auth);
  }
}

// Auth state listener
export function onAuthChange(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

// Save lead to Firestore if configured
export async function saveLeadToFirestore(leadData: Record<string, any>): Promise<string | null> {
  if (!db) {
    return null;
  }
  try {
    const docRef = await addDoc(collection(db, 'leads'), {
      ...leadData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    console.warn('Could not save lead to Firestore (falling back to backend API):', err);
    return null;
  }
}
