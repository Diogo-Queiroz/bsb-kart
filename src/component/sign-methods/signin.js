import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'

import { SignUpLink } from './signup'
import { PasswordForgetLink } from '../password-methods/pass-forget'
import { auth } from '../../firebase'
import * as routes from '../../constants/routes'

const SignInPage = ({ history }) =>
  <div className='container'>
    <h1>SignIn Page</h1>
    <div className='row'>
      <div className='col'></div>
      <div className='col-sm-12 col-md-8 col-lg-10'>
        <SignInForm history={history} />
        <PasswordForgetLink />
        <SignUpLink />
      </div>
    </div>
  </div>

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
})

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null
}

class SignInForm extends Component {
  constructor (props) {
    super (props)

    this.state = {...INITIAL_STATE}
  }

  submitForm = (e) => {
    const {
      email, password
    } = this.state
    const {
      history
    } = this.props

    auth.doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({...INITIAL_STATE})
        history.push(routes.HOME)
      })
      .catch(error => {
        this.setState(byPropKey('error', error))
      })

    e.preventDefault()
  }

  render () {
    const {
      email, password, error
    } = this.state

    const isInvalid = password === '' || email === ''

    return (
      <form onSubmit={this.submitForm}>

        <div className='form-group'>
          <label htmlFor='email'>E-mail:</label>
          <input type='email' id='email'
            className='form-control' placeholder='email'
            value={email} onChange={event => this.setState(byPropKey('email',
              event.target.value
            ))} />
        </div>

        <div className='form-group'>
          <label htmlFor='password'>Password:</label>
          <input type='password' id='password'
            className='form-control' placeholder='Password'
            value={password} onChange={event => this.setState(byPropKey('password',
              event.target.value
            ))} />
        </div>

        <div className='form-group'>
          <div className='row justify-content-md-around'>
            <button 
              className='btn btn-primary btn-lg col'
              type='submit' disabled={isInvalid}>Sign In
            </button>
            <button className='btn btn-danger btn-lg col' type='reset'>Reset</button>
          </div>
        </div>
        { error && <p>{ error.message }</p>}
      </form>
    )
  }
}

const SignInLink = () =>
  <p>
    Already have an account?
    <Link to={routes.SIGN_IN}>Sign In Here</Link>
  </p>

export default withRouter(SignInPage)

export { SignInForm, SignInLink }
