import * as auth from './auth'
import * as firebase from './firebase'

// Layer that protect the user to access direct the firebase file
export {
  auth, firebase
}