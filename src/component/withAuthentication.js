import React from 'react'
import { firebase } from '../firebase'
import AuthUserContext from './auth-user-context'

const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        authUser: null
      }
    }
    
    componentDidMount() {
      firebase.auth.onAuthStateChanged(authUser => {
        authUser ? this.setState({ authUser }) : this.setState({ authUser: null })
      })
    }
    
    render () {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      )
    }
  }
  return WithAuthentication
}

export default withAuthentication