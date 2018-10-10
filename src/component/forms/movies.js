import React, { Component } from 'react'
import withAuthorization from '../withAuthorization'
import { firebase } from '../../firebase'

class MovieList extends Component {
  constructor (props) {
    super(props)
    
    this.state = {
      list: []
    }

    this.submitForm = this.submitForm.bind(this)
  }

  submitForm (e) {
    e.preventDefault()
    console.log('Name -- ', this.refs.name.value.trim())
    console.log('Category -- ', this.refs.category.value.trim())
  }
  
  render () {
    return (
      <div>
        <form ref='form' onSubmit={this.submitForm}>
          <div className='form-group'>
            <label htmlFor='name'>Name</label>
            <input type='text' id='name' 
              className='form-control' placeholder='name of the movie'
              required ref='name' />
          </div>
          <div className='form-group'>
            <label htmlFor='category'>Category</label>
            <select className='form-control' id='category' required ref='category'>
              <option value='Action'>Action</option>
              <option value='Drama'>Drama</option>
            </select>
          </div>
          <div className='btn-group'>
            <button type='submit' className='btn btn-primary'>Submit</button>
            <button type='reset' className='btn btn-danger'>Cancel</button>
          </div>
        </form>
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
