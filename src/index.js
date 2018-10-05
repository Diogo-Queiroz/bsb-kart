import React from 'react'
import ReactDOM from 'react-dom'
import './css/index.css'
import App from './component/App'
import registerServiceWorker from './registerServiceWorker'
import * as firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyDHUybkHc15uMHwMg5LXKYafoJ7qJDT-Hw',
  authDomain: 'webkartead.firebaseapp.com',
  databaseURL: 'https://webkartead.firebaseio.com',
  projectId: 'webkartead',
  storageBucket: 'webkartead.appspot.com',
  messagingSenderId: '830284173823'
}
firebase.initializeApp(config)

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
