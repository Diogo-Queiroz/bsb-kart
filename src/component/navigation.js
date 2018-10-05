import React from 'react'
import { Link } from 'react-router-dom'

import * as routes from '../constants/routes'

const Navigation = () =>
  <ul>
    <li><Link to={routes.HOME}>Home</Link></li>
    <li><Link to={routes.ACCOUNT}>Account</Link></li>
    <li><Link to={routes.LANDING}>Landing</Link></li>
    <li><Link to={routes.PASS_FORGET}>Forget Password</Link></li>
    <li><Link to={routes.SIGN_UP}>Sign Up</Link></li>
    <li><Link to={routes.SIGN_IN}>Sign In</Link></li>
  </ul>

export default Navigation