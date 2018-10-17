import React, { Component } from 'react'
import AuthUserContext from './auth-user-context'
import { PasswordForgetForm } from './password-methods/pass-forget'
import PasswordChangeForm from './password-methods/pass-change'
import withAuthorization from './withAuthorization'
import { getCurrentUser } from '../firebase/database'

class RenderUsername extends Component {
  constructor (props) {
    super (props)
  
    this.state = {
      username: ''
    }
    this.getUser = this.getUser.bind(this)
  }

  getUser (id) {
    getCurrentUser(id).then(result => {
      console.log(result.val())
      this.setState({
        username: result.val().username
      })
    })
  }

  componentDidMount () {
    const { displayName, uid } = this.props.authUser
    const { providerId } = this.props.authUser.providerData[0]
    console.log('did mount', this.props)
    if (providerId === 'password') {
      this.getUser(uid)
    } else {
      this.setState({
        username: displayName
      })
    }
  }

  render () {
    const { username } = this.state
    return (
      <h1>Account Page: {username}</h1>
    )
  }
}

const AccountPage = () =>
      <AuthUserContext.Consumer>
      { authUser =>
        <div className='container'>
          <RenderUsername authUser={authUser} />
          <div className='row'>
            <div className='col'>
              <PasswordForgetForm />
            </div>
            <div className='col'>
              <PasswordChangeForm />
            </div>
          </div>
        </div>
      }
      </AuthUserContext.Consumer>

const authCondition = (authUser) => !!authUser

export default withAuthorization(authCondition)(AccountPage)
