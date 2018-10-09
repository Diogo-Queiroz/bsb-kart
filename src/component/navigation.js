import React from 'react'
import { Link } from 'react-router-dom'

import AuthUserContext from './auth-user-context'
import SignOutButton from './sign-methods/signout'
import * as routes from '../constants/routes'
import logo from '../img/helmet-logo-gray.svg'

const Navigation = () =>
  <AuthUserContext.Consumer>
    { authUser => authUser
        ? <NavigationAuth />
        : <NavigationNonAuth />
    }
  </AuthUserContext.Consumer>

const NavigationAuth = () =>
  <nav className='navbar navbar-expand-sm navbar-dark bg-dark'>
    <Link className='navbar-brand mb-0 h1' to={routes.LANDING}>
      <img src={logo}
        width='30' height='30' 
        className='d-inline-block align-top' alt='logo bsb kart' />BSB Kart
    </Link>
    <div className=''>
      <ul className='navigation'>
        <li>
          <Link className='nav-item nav-link' to={routes.HOME}>Home</Link>
        </li>
        <li>
          <Link className='nav-item nav-link' to={routes.ACCOUNT}>Account</Link>
        </li>
        <li>
          <Link className='nav-item nav-link' to={routes.MOVIES}>Movies</Link>
        </li>
      </ul>
    </div>
    <div className='right'>
      <ul className='navigation'>
        <li>
          <SignOutButton />
        </li>
      </ul>
    </div>
  </nav>
  
const NavigationNonAuth = () => 
  <nav className='navbar navbar-expand-sm navbar-dark bg-dark'>
    <Link className='navbar-brand mb-0 h1' to={routes.LANDING}>
      <img src={logo}
        width='30' height='30' 
        className='d-inline-block align-top' alt='logo bsb kart' />BSB Kart
    </Link>
    <div className='right'>
      <ul className='navigation'>
        <li>
          <Link className='nav-item nav-link' to={routes.SIGN_UP}>Sign Up</Link>
        </li>
        <li>
          <Link className='nav-item nav-link' to={routes.SIGN_IN}>Sign In</Link>
        </li>
      </ul>
    </div>
  </nav>

export default Navigation