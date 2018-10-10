import * as auth from './auth'
import * as firebase from './firebase'
import * as googleprovider from './google-auth'
import * as db from './database'

// Layer that protect the user to access direct the firebase file
export {
  auth, firebase, googleprovider
}