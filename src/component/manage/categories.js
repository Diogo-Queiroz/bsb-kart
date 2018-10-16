import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
  getCategories,
  categoryRef,
  dbRef,
  deleteCategory
} from '../../firebase/database'
import AuthUserContext from '../auth-user-context'
import withAuthorization from '../withAuthorization'

const byProperKey = (propertyName, value) => () => ({
  [propertyName]: value
})

const INITIAL_STATE = {
  category: '',
  refreshList: false,
  categories: [],
  isLoading: false
}

class CategoryForm extends Component {
  constructor (props) {
    super (props)

    this.state = { ...INITIAL_STATE }

    this.submitForm = this.submitForm.bind(this)
  }

  submitForm (e) {
    e.preventDefault()
    console.log('submiting')
    let categoryName = this.refs.category.value.trim()
    let id = this.props.authUser.email
    dbRef.child('categories').child(id).push(categoryName)
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
              <div className='row justify-content-around'>
                <button
                  type='submit'
                  className='btn btn-primary btn-lg'>
                  Submit
                </button>
                <button
                  type='reset'
                  className='btn btn-danger btn-lg'>
                  Cancel
                </button>
              </div>
            </div>
            {!!this.state.error && <p>Erro, tente novamente...</p>}
          </form>
        </div>
        <div className='col-md-2 col-lg-3'></div>
        <div className='row'>
          <div className='col-lg-12'>
            <CategoriesList authUser={this.props.authUser} refreshList={this.state.refreshList} />
          </div>
        </div>
      </div>
    )
  }
}

class CategoriesList extends Component {
  constructor (props) {
    super(props)
    
    this.state = { ...INITIAL_STATE }

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

  deleteCategory (id) {
    console.log('delete cat', id)
    deleteCategory(id)
      .then((result) => {
        console.log('category deleted', id)
        this.getCategories()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  componentDidMount () {
    this.getCategories()
  }
  
  componentWillReceiveProps (props) {
    const refreshList = this.props.refreshList
    if (props.refreshList !== refreshList) {
      this.getCategories()
    }
  }

  renderCategories (categories) {
    console.log(categories)
    return (
      <li key={categories.key} className='list-group-item'>
        <p className='text-center float-left'>{categories.name}</p>
        <button
          className='btn btn-default float-right'
          onClick={() => this.deleteCategory(categories.key)}>
            Delete
        </button>
      </li>
    )
  }

  render () {
    return (
      <div>
        MovieList
        {(this.state.categories.length === 0 && this.state.isLoading) &&
          this.state.isLoading && <p>Carregando, aguarde...</p>
        }
        <ul className='list-group'>
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