import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config';

/**
 * Sign in admin using email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').User>}
 */
export const loginAdmin = async (email, password) => {
  try {
    if (!auth) {
      throw new Error('Firebase Auth belum dikonfigurasi. Periksa file .env Anda.');
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error in loginAdmin:', error);
    throw error;
  }
};

/**
 * Sign out current admin user
 * @returns {Promise<void>}
 */
export const logoutAdmin = async () => {
  try {
    if (!auth) {
      throw new Error('Firebase Auth belum dikonfigurasi.');
    }
    await signOut(auth);
  } catch (error) {
    console.error('Error in logoutAdmin:', error);
    throw error;
  }
};

/**
 * Listen for authentication state changes
 * @param {(user: import('firebase/auth').User | null) => void} callback
 * @returns {() => void} Unsubscribe function
 */
export const onAuthChange = (callback) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

/**
 * Get current authenticated user synchronously
 * @returns {import('firebase/auth').User | null}
 */
export const getCurrentUser = () => {
  return auth ? auth.currentUser : null;
};
