import React from 'react'
import { auth } from '../../firebase'

const SignOutButton = () =>
  <button type='button'
    className='btn'
    onClick={auth.doSignOut}
  >
    <span className='hide-small'>Sign Out  </span>
    <i className='fas fa-sign-out-alt'></i>
  </button>

export default SignOutButton
