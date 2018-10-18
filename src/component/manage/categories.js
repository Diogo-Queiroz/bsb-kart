import React, { Component } from 'react'
import {
  getCategories,
  dbRef,
  deleteCategory,
  getUserCategory
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
    let id = this.props.authUser.uid
    console.log(this.props.authUser)
    console.log(categoryName)
    dbRef.child(`categories/${id}`).push({name: categoryName})
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
                  Cancelar
                </button>
              </div>
            </div>
            {!!this.state.error && <p>Erro, tente novamente...</p>}
          </form>
          <hr />
          <CategoriesList authUser={this.props.authUser} refreshList={this.state.refreshList} />
        </div>
        <div className='col-md-2 col-lg-3'></div>
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

  uid = this.props.authUser.uid

  getCategories () {
    getCategories()
      .then(snapshot => {
        console.log('get categories', snapshot.val())
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
  
  getUserCategories (id) {
    getUserCategory(id)
      .then((result) => {
        console.log('get user categories', result.val())
        this.setState({
          isLoading: true
        })
        let data = result.val()
        let category = []
        Object.keys(data).map((item) => {
          console.log(data[item].name)
          category.push({
            key: item,
            name: data[item].name
          })
        })
        this.setState({
          isLoading: false,
          categories: category
        })
      })
      .catch(error => console.log(error))
  }

  deleteCategory (id, userId) {
    console.log('delete cat', id)
    deleteCategory(id, userId)
      .then(() => {
        console.log(`category deleted from user ${this.uid}, ${id}`)
        this.getUserCategories(this.uid)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  componentDidMount () {
    //this.getCategories()
    this.getUserCategories(this.uid)
  }
  
  componentWillReceiveProps (props) {
    const refreshList = this.props.refreshList
    if (props.refreshList !== refreshList) {
      //this.getCategories()
      this.getUserCategories(this.uid)
    }
  }

  renderCategories (categories) {
    console.log('render categories', categories)
    return (
      <tr key={categories.key}>
        <td>{categories.name}</td>
        <td>
          <button
            className='btn btn-default'
            onClick={() => this.deleteCategory(categories.key, this.uid)}>
              Deletar
          </button>
        </td>
      </tr>
    )
  }

  render () {
    return (
      <div>
        <table className='table table-hover table-sm'>
          <thead className='thead-light'>
            <tr>
              <th colSpan='2'>Category List</th>
            </tr>
            <tr>
              <th scope='col'>Name</th>
              <th scope='col'>Delete?</th>
            </tr>
          </thead>
          <tbody>
            {(this.state.categories.length !== 0 && !this.state.isLoading) &&
              this.state.categories.map((categories) => this.renderCategories(categories))
            }
          </tbody>
        </table>
        {this.state.isLoading && <p>Carregando, aguarde...</p>}
      </div>
    )
  }
  
}

const CategoriesPage = (props) => 
  <AuthUserContext.Consumer>    
    { authUser => 
      <div className='container'>
        <h1>Categories Page</h1>
        <CategoryForm authUser={authUser} props={props}/>
      </div>
    }
  </AuthUserContext.Consumer>

const authCondition = (authUser) => !!authUser

export default withAuthorization(authCondition)(CategoriesPage)