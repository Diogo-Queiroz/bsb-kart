import React, { Component } from 'react'
import withAuthorization from '../withAuthorization'
import { firebase } from '../../firebase'

const arr = []

const findRecords = () => {
  return firebase.database().ref('speed').on('value', (snapshot) => {
    console.log(snapshot.val())
    arr.push(snapshot.val())
  })
}

class MovieList extends Component {
  constructor (props) {
    super(props)
    
    this.state = {
      list: []
    }
  }
  
  componentDidMount () {
    console.log(arr)
  }
  
  render () {
    
    firebase.database().ref('speed').on('value', (snapshot) => {
      console.log(snapshot.val())
    })
    
    return (
      <div>
        {this.state.list.map((item) => 
          <p>{item}</p>
        )}
      </div>
    )
  }
}

const MoviesPage = () =>
  <div>
    <h1>Movies Page</h1>
    <p>This page is only visible from signed in users</p>
    <MovieList />
  </div>

const authCondition = (authUser) => !!authUser

export default withAuthorization(authCondition)(MoviesPage)
