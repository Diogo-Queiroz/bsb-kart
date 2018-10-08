import firebase from 'firebase/app'
import 'firebase/auth'

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

export {
  auth
}