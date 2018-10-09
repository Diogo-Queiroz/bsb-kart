import React from 'react'
import withAuthorization from './withAuthorization'

const HomePage = () =>
  <div>
    <h1>Home Page</h1>
    <p>This page is only visible from signed in users</p>
  </div>

const authCondition = (authUser) => !!authUser

export default withAuthorization(authCondition)(HomePage)
