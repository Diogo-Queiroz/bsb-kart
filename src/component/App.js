import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
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
import CategoriesPage from './manage/categories'
import SituationsPage from './manage/situations'
import ChannelsPage from './manage/channels'

import * as routes from '../constants/routes'

const App = () =>
  <div className="App">
    <Router>
      <div>
        <Navigation />
        <Route exact path={routes.MOVIES} component={MoviesPage} />
        <Route exact path={routes.MANAGE_CATEGORIES} component={CategoriesPage} />
        <Route exact path={routes.MANAGE_SITUATIONS} component={SituationsPage} />
        <Route exact path={routes.MANAGE_CHANNEL} component={ChannelsPage} />
        <Route exact path={routes.HOME} component={HomePage} />
        <Route exact path={routes.ACCOUNT} component={AccountPage} />
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
