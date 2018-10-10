import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import logo from '../img/logo.svg'
import '../css/App.css'

import withAuthentication from './withAuthentication'

import TrackInfo from './TrackInfo'
import Navigation from './navigation'
import HomePage from './home'
import LandingPage from './landing'
import AccountPage from './account'
import SignUpPage from './sign-methods/signup'
import SignInPage from './sign-methods/signin'
import PassForgetPage from './password-methods/pass-forget'

import MoviesPage from './forms/movies'

import * as routes from '../constants/routes'

const App = () => 
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">Welcome to React</h1>
    </header>
    <Router>
      <div>
        <Navigation />
        <hr />
        <Route exact path={routes.HOME} component={HomePage} />
        <Route exact path={routes.ACCOUNT} component={AccountPage} />
        <Route exact path={routes.MOVIES} component={MoviesPage} />
        <Route exact path={routes.SIGN_UP} component={SignUpPage} />
        <Route exact path={routes.SIGN_IN} component={SignInPage} />
        <Route exact path={routes.LANDING} component={LandingPage} />
        <Route exact path={routes.PASS_FORGET} component={PassForgetPage} />

      </div>
    </Router>
    <p className="App-intro">
      To get started, edit <code>src/App.js</code> and save to reload.
    </p>
    <TrackInfo />
  </div>

export default withAuthentication(App)
