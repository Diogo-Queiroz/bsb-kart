import React, { Component } from 'react'
import { auth } from '../../firebase'

const byProperKey = (propertyName, value) => () => ({
  [propertyName]: value
})

const INITIAL_STATE = {
  passOne: '', passTwo: '', error: null
}

class PasswordChangeForm extends Component {
  constructor (props) {
    super (props)
    
    this.state = {
      ...INITIAL_STATE
    }
  }
  
  submitForm = (e) => {
    const { passOne } = this.state
    
    auth.doPasswordChange(passOne)
      .then(() => {
        this.setState({...INITIAL_STATE})
      })
      .catch(error => {
        this.setState(byProperKey('error', error))
      })
    e.preventDefault()
  }
  
  render () {
    const {
      passOne, passTwo, error
    } = this.state
    
    const isInvalid = passOne !== passTwo || passTwo === ''
    
    return (
      <form onSubmit={this.submitForm}>
        <div className='form-group'>
          <label htmlFor='passwordOne'>Password:</label>
          <input type='password' id='passwordOne'
            className='form-control' placeholder='New Password'
            value={passOne} onChange={event => this.setState(byProperKey('passOne',
              event.target.value
            ))} />
        </div>

        <div className='form-group'>
          <label htmlFor='passwordTwo'>Confirm Password:</label>
          <input type='password' id='passwordTwo'
            className='form-control' placeholder='Confirm new Password' 
            value={passTwo} onChange={event => this.setState(byProperKey('passTwo',
              event.target.value
            ))}/>
        </div>

        <div className='form-group'>
          <div className='row justify-content-md-around'>
            <button 
              className='btn btn-success btn-lg col'
              type='submit' disabled={isInvalid}>Change Password
            </button>
          </div>
        </div>
        { error && <p>{ error.message }</p>}
      </form>
    )
  }
}

export default PasswordChangeForm