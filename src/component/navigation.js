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
  <nav id='navbar' className='navbar navbar-expand-sm navbar-dark bg-dark fixed-menu'>
    <Link className='navbar-brand mb-0 h1' to={routes.LANDING}>
      {/*<img src={logo}
        width='30' height='30' 
        className='d-inline-block align-top' alt='logo bsb kart' />*/}
        <i className='fas fa-archive'></i>G.S.F.
    </Link>
    <div>
      <ul className='navigation'>
        <li>
          <Link className='nav-item nav-link' to={routes.HOME}>
            Home
          </Link>
        </li>
        <li className='dropdown'>
          <span
            className='nav-item nav-link'
            href='#'
            >
              Minhas Listas
          </span>
          <div className='dropdown-content'>
            <Link className='nav-item nav-link' to={routes.MOVIES}>
              <i className='fas fa-video'></i>  Movies
            </Link>
            <Link className='nav-item nav-link' to={routes.MOVIES}>
              <i className='fas fa-tv'></i>  Series
            </Link>
            <Link className='nav-item nav-link' to={routes.MOVIES}>
              <i className='fas fa-gamepad'></i>  Games
            </Link>
          </div>
        </li>
        <li className='dropdown'>
          <span
            className='nav-item nav-link'
            href='#'
            >
              Gerenciar
          </span>
          <div className='dropdown-content'>
            <Link className='nav-item nav-link' to={routes.MANAGE_CATEGORIES}>Categories</Link>
            <Link className='nav-item nav-link' to={routes.MANAGE_SITUATIONS}>Situations</Link>
            <Link className='nav-item nav-link' to={routes.MANAGE_CHANNEL}>Channels</Link>
            <Link className='nav-item nav-link' to={routes.MANAGE_PLATFORMS}>Platforms</Link>
            <Link className='nav-item nav-link' to={routes.MANAGE_PROGRESS}>Progress</Link>
          </div>
        </li>
      </ul>
    </div>
    <div className='right'>
      <ul className='navigation'>
        <li>
          <Link className='nav-item nav-link' to={routes.ACCOUNT}>
            <span className='hide-small'>Perfil  </span>
            <i className="fas fa-user"></i>
          </Link>
        </li>
        <li>
          <SignOutButton />
        </li>
      </ul>
    </div>
  </nav>
  
const NavigationNonAuth = () => 
  <nav id='navbar' className='navbar navbar-expand-sm navbar-dark bg-dark fixed-menu'>
    <Link className='navbar-brand mb-0 h1' to={routes.LANDING}>
      {/*<img src={logo}
        width='30' height='30' 
        className='d-inline-block align-top' alt='logo bsb kart' />*/}
        <i className='fas fa-archive'></i>G.S.F.
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