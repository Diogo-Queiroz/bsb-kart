import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as routes from '../constants/routes'

const SignUpPage = () =>
  <div className='container'>
    <h1>SignUp Page</h1>
    <div className='row'>
      <div className='col'></div>
      <div className='col-sm-12 col-md-8 col-lg-10'>
        <SignUpForm />
      </div>
      <div className='col'></div>
    </div>
  </div>

class SignUpForm extends Component {
  constructor (props) {
    super(props)
  }

  submitForm = (e) => {
    e.preventDefault()
    console.log('form submitted')
  }

  render () {
    return (
      <form onSubmit={this.submitForm}>
        <div className='form-group'>
          <label htmlFor='username'>Full Name:</label>
          <input type='text' id='username'
            className='form-control' placeholder='Full Name'/>
        </div>
        <div className='form-group'>
          <label htmlFor='email'>E-mail:</label>
          <input type='email' id='email'
            className='form-control' placeholder='email' />
        </div>

        <div className='form-group'>
          <label htmlFor='passwordOne'>Password:</label>
          <input type='password' id='passwordOne'
            className='form-control' placeholder='Password' />
        </div>

        <div className='form-group'>
          <label htmlFor='passwordTwo'>Confirm Password:</label>
          <input type='password' id='passwordTwo'
            className='form-control' placeholder='Password' />
        </div>

        <div className='form-group'>
          <div className='row justify-content-md-around'>
            <button className='btn btn-primary btn-lg col' type='submit'>Sign Up</button>
            <button className='btn btn-danger btn-lg col' type='reset'>Reset</button>
          </div>
        </div>
      </form>
    )}
}

const SignUpLink = () =>
  <p>
    Don't have an account??
    <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>

export default SignUpPage

export {
  SignUpForm, SignUpLink
}