import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'

import { auth, database } from '../../firebase'
import * as routes from '../../constants/routes'
import { SignInLink } from './signin'

// Object representing the initial state of this component
const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null
}

const SignUpPage = ({ history }) =>
  <div className='container'>
    <h1>SignUp Page</h1>
    <div className='row'>
      <div className='col'></div>
      <div className='col-sm-12 col-md-8 col-lg-6'>
        <SignUpForm history={history} />
      </div>
      <div className='col'></div>
    </div>
    <SignInLink />
  </div>

const byPropKey = (propertyKey, value) => () => ({
  [propertyKey]: value
})

class SignUpForm extends Component {
  constructor (props) {
    super(props)
    // Now we can create a object state with same structure, thanks to '...' feature
    this.state = {...INITIAL_STATE}
  }

  submitForm = (e) => {
    const {
      username, email,
      passwordOne
    } = this.state

    const {
      history
    } = this.props

    auth.doCreateUserWithEmailAndPassword (email, passwordOne)
      .then(authUser => {
        console.log(authUser)
        database.doCreateUser(authUser.user.uid, username, email)
          .then(() => {
            console.log(authUser.user.uid)
            this.setState(() => ({...INITIAL_STATE}))
            history.push(routes.HOME)
        })
        .catch(error => {
          this.setState(byPropKey('error', error))
        })
      })
      .catch(error => {
        this.setState(byPropKey('error', error))
      })
    
      e.preventDefault()
  }

  render () {
    const { //This feature is called, desconstructing.
      username, email,
      passwordOne, passwordTwo,
      error
    } = this.state

    

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === ''

    return (
      <form onSubmit={this.submitForm}>
        <div className='form-group'>
          <label htmlFor='username'>Full Name:</label>
          <input type='text' id='username'
            className='form-control' placeholder='Full Name'
            value={username} onChange={event => this.setState(byPropKey('username',
              event.target.value
            ))} />
        </div>
        <div className='form-group'>
          <label htmlFor='email'>E-mail:</label>
          <input type='text' id='email'
            className='form-control' placeholder='email'
            value={email} onChange={event => this.setState(byPropKey('email',
              event.target.value
            ))} />
        </div>

        <div className='form-group'>
          <label htmlFor='passwordOne'>Password:</label>
          <input type='password' id='passwordOne'
            className='form-control' placeholder='Password'
            value={passwordOne} onChange={event => this.setState(byPropKey('passwordOne',
              event.target.value
            ))} />
        </div>

        <div className='form-group'>
          <label htmlFor='passwordTwo'>Confirm Password:</label>
          <input type='password' id='passwordTwo'
            className='form-control' placeholder='Password' 
            value={passwordTwo} onChange={event => this.setState(byPropKey('passwordTwo',
              event.target.value
            ))}/>
        </div>

        <div className='form-group'>
          <div className='row justify-content-md-around'>
            <button 
              className='btn btn-primary btn-lg col'
              type='submit' disabled={isInvalid}>Sign Up
            </button>
            <button className='btn btn-danger btn-lg col' type='reset'>Reset</button>
          </div>
        </div>
        { error && <p>{ error.message }</p>}
      </form>
    )}
}

const SignUpLink = () =>
  <p>
    Don't have an account?? 
    <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>

export default withRouter(SignUpPage)

export {
  SignUpForm, SignUpLink
}