import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { auth } from '../../firebase'
import * as routes from '../../constants/routes'
import { SignUpLink } from '../sign-methods/signup'

const PasswordForgetPage = () =>
  <div className='container'>
    <h1>Password Forget Page</h1>
    <div className='row'>
      <div className='col'></div>
      <div className='col-sm-12 col-md-8 col-lg-6'>
        <PasswordForgetForm />
        <SignUpLink />
      </div>
      <div className='col'></div>
    </div>
  </div>

const INITIAL_STATE = {
  email: '', error: null
}

const byProperKey = (propertyName, value) => () => ({
  [propertyName]: value
})

class PasswordForgetForm extends Component {
  constructor (props) {
    super (props)
    
    this.state = { ...INITIAL_STATE }
  }
  
  submitForm = (e) => {
    auth.doPasswordReset(this.state.email)
      .then(() => {
        this.setState({ ...INITIAL_STATE  })
      })
      .catch(error => {
        this.setState(byProperKey('error', error))
      })
    e.prevendDefault()
  }
  
  render () {
    const isInvalid = this.state.email === ''
    return (
      <form onSubmit={this.submitForm}>
      
      <div className='form-group'>
          <label htmlFor='email'>E-mail:</label>
          <input type='email' id='email'
            className='form-control' placeholder='email'
            value={this.state.email} onChange={event => this.setState(byProperKey('email',
              event.target.value
            ))} />
        </div>

        <div className='form-group'>
          <div className='row justify-content-md-around'>
            <button 
              className='btn btn-primary btn-lg col'
              type='submit' disabled={isInvalid}>Reset Password
            </button>
            
          </div>
        </div>
        { this.state.error && <p>{ this.state.error.message }</p>}
      
      </form>
    )
  }
}

const PasswordForgetLink = () =>
  <p>
    <Link to={routes.PASS_FORGET}>Forgot your password? Click Here</Link>
  </p>

export default PasswordForgetPage

export { PasswordForgetForm, PasswordForgetLink }