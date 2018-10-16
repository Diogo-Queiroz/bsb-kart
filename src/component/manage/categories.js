import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { getCategories, categoryRef, dbRef } from '../../firebase/database'
import AuthUserContext from '../auth-user-context'
import withAuthorization from '../withAuthorization'

const byProperKey = (propertyName, value) => () => ({
  [propertyName]: value
})

class CategoryForm extends Component {
  constructor (props) {
    super (props)

    this.state = {
      category: '',
      refreshList: false
    }

    this.submitForm = this.submitForm.bind(this)
  }

  submitForm (e) {
    e.preventDefault()
    console.log('submiting')
    let categoryName = {
      name: this.refs.category.value.trim()
    }
    dbRef.child('categories').push(categoryName)
      .then((data) => {
        console.log(data.key)
        this.setState({
          refreshList: !this.state.refreshList,
          category: ''
        })
      })
  }

  render () {
    const style = {
      colLabel: 'col-sm-3 col-form-label',
      colInput: 'col-sm-9'
    }

    return (
      <div className='row'>
        <div className='col-md-2 col-lg-3'></div>
        <div className='col-sm-12 col-md-8 col-lg-6'>
          <p>This page is only visible from signed in users</p>
          <form ref='form' onSubmit={this.submitForm}>
            <div className='form-group row'>
              <label htmlFor='category' className={style.colLabel}>Category Name</label>
              <div className={style.colInput}>
                <input type='text' id='category'
                  className='form-control my-input-style'
                  placeholder='Category name'
                  value={this.state.category}
                  onChange={event => this.setState(
                    byProperKey('category', event.target.value)
                  )}
                  required ref='category' />
              </div>
            </div>
            
            <div className='form-group'>
              <div className='row justify-content-md-around'>
                <button
                  type='submit'
                  className='btn btn-primary btn-lg col'>
                  Submit
                </button>
                <button
                  type='reset'
                  className='btn btn-danger btn-lg col'>
                  Cancel
                </button>
              </div>
            </div>
            {!!this.state.error && <p>Erro, tente novamente...</p>}
          </form>
        </div>
        <div className='col-md-2 col-lg-3'></div>
        <div className='row'>
          <CategoriesList authUser={this.props.authUser} refreshList={this.state.refreshList} />
        </div>
      </div>
    )
  }
}

class CategoriesList extends Component {
  constructor (props) {
    super(props)
    
    this.state = { categories: [], isLoading: false }

    //this.getUserMovieList = this.getUserMovieList.bind(this)
    //this.deleteCurrentMovie = this.deleteCurrentMovie.bind(this)
    this.getCategories = this.getCategories.bind(this)
  }

  getCategories () {
    getCategories()
      .then(snapshot => {
        console.log(snapshot.val())
        this.setState({
          isLoading: true
        })
        let data = snapshot.val()
        let category = []
        Object.keys(data).forEach((key) => {
          category.push({
            key: key,
            name: data[key].name
          })
        })
        this.setState({
          isLoading: false,
          categories: category
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  /*getUserMovieList () {
    onceGetMovies().then(snapshot => {
      this.setState({
        isLoading: true
      })
      let data = snapshot.val()
      let item = []
      Object.keys(data).forEach((key) => {
        if (data[key].user === this.props.authUser.email) {
          item.push({
            key: key,
            name: data[key].name,
            category: data[key].category,
            situation: data[key].situation,
            comments: data[key].comments,
            user: data[key].user,
            imgUrl: (data[key].imgUrl) ? data[key].imgUrl : ''
          })
        }})
      this.setState({
        isLoading: false,
        movieList: item
      })}
    )
    .catch(error => {
      this.setState({
        error: error
      })
    })
  }

  deleteCurrentMovie (id) {
    console.log('Call delete movie method on key, ', id)
    deleteMovie(id)
      .then((result) => {
        console.log('sucess -> ', result)
        this.getUserMovieList()
      })
      .catch((error) => {
        console.log('error -> ', error)
      })
    /*getCurrentMovie(id).remove()
      .then((result) => {
        console.log(result)
        this.getUserMovieList()
      })
      .catch((error) => {
        console.log(error)
      })*/
    //console.log(id)
  //}

  componentDidMount () {
    //console.log('component did mount')
    this.getCategories()
  }
  
  componentWillReceiveProps (props) {
    //console.log('Component will receive this props -> ', props)
    const refreshList = this.props.refreshList
    if (props.refreshList !== refreshList) {
      this.getCategories()
    }
  }

  renderCategories (categories) {
    console.log(categories)
    return (
      <li key={categories.key}>
        {categories.name}<button>Delete</button>
      </li>
    )
  }

  render () {
    return (
      <div>
        MovieList
        {this.state.isLoading && <p>Carregando, aguarde...</p>}
        <ul>
          {(this.state.categories.length !== 0 && !this.state.isLoading) &&
            this.state.categories.map((categories) => this.renderCategories(categories))
          }
        </ul>
      </div>
    )
  }
  
}

const CategoriesPage = (props) => 
  <AuthUserContext.Consumer>    
    { authUser => 
      <div className='container'>
        <h1>Movies Page</h1>
        <CategoryForm authUser={authUser} props={props}/>
      </div>
    }
  </AuthUserContext.Consumer>

const authCondition = (authUser) => !!authUser

export default withAuthorization(authCondition)(CategoriesPage)