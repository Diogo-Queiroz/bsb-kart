import React, { Component } from 'react'
import AuthUserContext from '../auth-user-context'
import withAuthorization from '../withAuthorization'
import { firebase } from '../../firebase/firebase'
import { dbRef, dbMovieRef } from '../../firebase/database'

class MovieForm extends Component {
  constructor (props) {
    super(props)
    
    this.state = {
      list: []
    }

    this.submitForm = this.submitForm.bind(this)
  }

  submitForm (e) {
    e.preventDefault()
    let Data = new Date()
    let infos = {
      date: Data.toLocaleDateString(),
      name: this.refs.name.value.trim(),
      category: this.refs.category.value.trim(),
      situation: this.refs.situation.value.trim(),
      comments: this.refs.comments.value.trim(),
      user: this.props.authUser.email
    }
    dbRef.child('movies').push(infos)
  }
  
  render () {
    const style = {
      colLabel: 'col-sm-3 col-form-label',
      colInput: 'col-sm-9'
    }
    
    return (
      <div>
        <form ref='form' onSubmit={this.submitForm}>
          <div className='form-group row'>
            <label htmlFor='name' className={style.colLabel}>Movie Name</label>
            <div className={style.colInput}>
              <input type='text' id='name' 
                className='form-control my-input-style' placeholder='name of the movie'
                required ref='name' />
            </div>
          </div>
          <div className='form-group row'>
            <label htmlFor='category' className={style.colLabel}>Category</label>
            <div className={style.colInput}>
              <select className='form-control my-input-style' id='category' required ref='category'>
                <option value='Action'>Action</option>
                <option value='Drama'>Drama</option>
              </select>
            </div>
          </div>
          <div className='form-group row'>
            <label htmlFor='situation' className={style.colLabel}>Situação:</label>
            <div className={style.colInput}>
              <select className='form-control my-input-style' id='situation' required ref='situation'>
                <option value='watched'>Assistido</option>
                <option value='to watch'>Assistir</option>
              </select>
            </div>
          </div>
          <div className='form-group row'>
            <label htmlFor='comments' className={style.colLabel}>Comments:</label>
            <div className={style.colInput}>
              <textarea className='form-control' id='comments' rows='4' ref='comments'></textarea>
            </div>
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

class MovieList extends Component {
  constructor (props) {
    super(props)
    
    this.state = {
      movieList: [],
      visibleList: false
    }
    this.getMovieList = this.getMovieList.bind(this)
    this.toogleMovieList = this.toogleMovieList.bind(this)
  }
  
  getMovieList () {
    let newMovies = []
    dbMovieRef.on('child_added', (snapshot) => {
      let item = {
        name: snapshot.val().name,
        category: snapshot.val().category,
        date: snapshot.val().date,
        situation: snapshot.val().situation,
        comments: snapshot.val().comments
      }
      newMovies.push(item)
    })
    this.setState({
      movieList: newMovies
    })
  }
  
  componentDidMount () {
    console.log('component did mount')
  }
  
  componentWillUpdate () {
    console.log('component will update')
  }
  
  componentDidUpdate () {
    console.log('component did update')
  }
  
  componentWillMount () {
    console.log('component will mount')
  }
  
  toogleMovieList () {
    this.setState({
      visibleList: !this.state.visibleList
    })
  }
  
  render () {
    return (
      <div>
        MovieList
        {!!this.state.visibleList && <p>{this.state.movieList[0]}</p>}
        <button onClick={this.toogleMovieList}>Show/Hide MovieList</button>
      </div>
    )
  }
  
}

const MoviesPage = () =>
  <AuthUserContext.Consumer>    
    { authUser => 
      <div className='container'>
        <h1>Movies Page</h1>
        <div className='row'>
          <div className='col'></div>
          <div className='col-sm-12 col-md-8 col-lg-6'>
            <p>This page is only visible from signed in users</p>
            <MovieForm authUser={authUser}/>
          </div>
          <div className='col'></div>
        </div>
        <MovieList />
      </div>
    }
  </AuthUserContext.Consumer>

const authCondition = (authUser) => !!authUser

export default withAuthorization(authCondition)(MoviesPage)
