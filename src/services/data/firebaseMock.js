// src/firebaseMock.js
// Mocked Firebase for local development

export const initializeApp = () => ({});
export const getAuth = () => ({});
export const onAuthStateChanged = (auth, callback) => {
  callback({ uid: 'local-user' });
  return () => {};
};
export const signInAnonymously = async () => ({ user: { uid: 'local-user' } });
export const signInWithCustomToken = async () => ({ user: { uid: 'local-user' } });
export const getFirestore = () => ({});
export const doc = (...args) => args.join('/');
export const setDoc = async () => {};
export const getDoc = async () => ({ exists: () => false, data: () => ({}) });
export const updateDoc = async () => {};
export const serverTimestamp = () => new Date().toISOString();
