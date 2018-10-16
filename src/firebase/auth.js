import { auth } from './firebase'

// Sign Up Method
export const doCreateUserWithEmailAndPassword = (username, email, password) =>
  auth.createUserAndRetrieveDataWithEmailAndPassword(username, email, password)

// Sign In Method
export const doSignInWithEmailAndPassword = (email, password) =>
  auth.signInWithEmailAndPassword(email, password)

// Sign Out Method
export const doSignOut = () =>
  auth.signOut()

// Password Reset and Change methods
export const doPasswordReset = (email) =>
  auth.sendPasswordResetEmail(email)

export const doPasswordChange = (password) =>
  auth.currentUser.updatePassword(password)