import React from 'react'
import AuthUserContext from './auth-user-context'
import { PasswordForgetForm } from './password-methods/pass-forget'
import PasswordChangeForm from './password-methods/pass-change'
import withAuthorization from './withAuthorization'

const AccountPage = () =>
  <AuthUserContext.Consumer>
    { authUser =>
      <div className='container'>
        <h1>Account Page: {authUser.email}</h1>
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
