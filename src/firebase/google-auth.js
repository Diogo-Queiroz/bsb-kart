import React from 'react'
import { auth, googleProvider } from './firebase'

export const GoogleLogin = (provider) => {
  console.log(provider)
  auth.signInWithPopup(provider)
    .then((result) => {
      let token = result.credential.accessToken
      let user = result.user
      console.log(token)
      console.log(user)
    })
    .catch((error) => {
      let errorCode = error.code
      let errorMessage = error.message
      let email = error.email
      let credential = error.credential
      console.log(errorCode)
      console.log(errorMessage)
      console.log(email)
      console.log(credential)
    })
}

