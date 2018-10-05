import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import logo from '../img/logo.svg'
import '../css/App.css'
import * as firebase from 'firebase'

import Ola from './Ola'
import TrackInfo from './TrackInfo'
import Navigation from './navigation'
import HomePage from './home'
import LandingPage from './landing'
import AccountPage from './account'
import SignUpPage from './signup'
import SignInPage from './signin'
import PassForgetPage from './pass-forget'

import * as routes from '../constants/routes'

class App extends Component {

  constructor() {
    super();
    this.state = {
      speed: 10
    };
  }

  componentDidMount() {
    const rootRef = firebase.database().ref().child('speed');
    rootRef.on('value', snap => {
      this.setState({
        speed: snap.val()
      });
    });
  }

  render() {
    return (
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
            <Route exact path={routes.SIGN_UP} component={SignUpPage} />
            <Route exact path={routes.SIGN_IN} component={SignInPage} />
            <Route exact path={routes.LANDING} component={LandingPage} />
            <Route exact path={routes.PASS_FORGET} component={PassForgetPage} />

          </div>
        </Router>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Ola name='Diogo' /><br />
        and I'm the fastest man alive, checkou my speed = {this.state.speed}
        <TrackInfo />
      </div>
    );
  }
}

export default App
