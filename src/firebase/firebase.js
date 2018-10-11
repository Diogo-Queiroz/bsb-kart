import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

const prodConfig = {
  apiKey: 'AIzaSyDHUybkHc15uMHwMg5LXKYafoJ7qJDT-Hw',
  authDomain: 'webkartead.firebaseapp.com',
  databaseURL: 'https://webkartead.firebaseio.com',
  projectId: 'webkartead',
  storageBucket: 'webkartead.appspot.com',
  messagingSenderId: '830284173823'
}

const devConfig = {
  apiKey: 'AIzaSyDHUybkHc15uMHwMg5LXKYafoJ7qJDT-Hw',
  authDomain: 'webkartead.firebaseapp.com',
  databaseURL: 'https://webkartead.firebaseio.com',
  projectId: 'webkartead',
  storageBucket: 'webkartead.appspot.com',
  messagingSenderId: '830284173823'
}

const config = process.env.NODE_ENV === 'production'
  ? prodConfig
  : devConfig

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

const auth = firebase.auth()
const googleProvider = new firebase.auth.GoogleAuthProvider()
const database = firebase.database()

// get a reference to the storage service
const storage = firebase.storage()

export {
  auth,
  googleProvider,
  database,
  storage
}