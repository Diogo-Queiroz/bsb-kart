import React from 'react'
import { Link } from 'react-router-dom'

import * as routes from '../constants/routes'
import logo from '../img/helmet-logo-gray.svg'

const Navigation = () =>
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
          <Link className='nav-item nav-link' to={routes.LANDING}>Landing</Link>
        </li>
      </ul>
    </div>
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