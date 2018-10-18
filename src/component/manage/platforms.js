import React, { Component } from 'react'
import {
  dbRef,
  deletePlatform,
  getUserPlatform
} from '../../firebase/database'
import AuthUserContext from '../auth-user-context'
import withAuthorization from '../withAuthorization'

const byProperKey = (propertyName, value) => () => ({
  [propertyName]: value
})

const INITIAL_STATE = {
  platform: '',
  refreshList: false,
  platforms: [],
  isLoading: false
}

class PlatformForm extends Component {
  constructor (props) {
    super (props)

    this.state = { ...INITIAL_STATE }

    this.submitForm = this.submitForm.bind(this)
  }

  submitForm (e) {
    e.preventDefault()
    console.log('submiting')
    let platformName = this.refs.platform.value.trim()
    let id = this.props.authUser.uid
    console.log(this.props.authUser)
    console.log(platformName)
    dbRef.child(`platforms/${id}`).push({name: platformName})
      .then((data) => {
        console.log(data.key)
        this.setState({
          refreshList: !this.state.refreshList,
          platform: ''
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
              <label htmlFor='platform' className={style.colLabel}>Platform Name</label>
              <div className={style.colInput}>
                <input type='text' id='platform'
                  className='form-control my-input-style'
                  placeholder='Platform name'
                  value={this.state.platform}
                  onChange={event => this.setState(
                    byProperKey('platform', event.target.value)
                  )}
                  required ref='platform' />
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
          <PlatformList authUser={this.props.authUser} refreshList={this.state.refreshList} />
        </div>
        <div className='col-md-2 col-lg-3'></div>
      </div>
    )
  }
}

class PlatformList extends Component {
  constructor (props) {
    super(props)
    
    this.state = { ...INITIAL_STATE }
  }

  uid = this.props.authUser.uid

  getUserPlatform (id) {
    getUserPlatform(id)
      .then((result) => {
        console.log('get user platform', result.val())
        this.setState({
          isLoading: true
        })
        let data = result.val()
        let platform = []
        Object.keys(data).map((item) => {
          console.log(data[item].name)
          platform.push({
            key: item,
            name: data[item].name
          })
        })
        this.setState({
          isLoading: false,
          platforms: platform
        })
      })
      .catch(error => console.log(error))
  }

  deletePlatform (id, userId) {
    console.log('delete platform', id)
    deletePlatform(id, userId)
      .then(() => {
        console.log(`platform deleted from user ${this.uid}, ${id}`)
        this.getUserPlatform(this.uid)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  componentDidMount () {
    this.getUserPlatform(this.uid)
  }
  
  componentWillReceiveProps (props) {
    const refreshList = this.props.refreshList
    if (props.refreshList !== refreshList) {
      this.getUserPlatform(this.uid)
    }
  }

  renderPlatforms (platforms) {
    console.log('render platforms', platforms)
    return (
      <tr key={platforms.key}>
        <td>{platforms.name}</td>
        <td>
          <button
            className='btn btn-default'
            onClick={() => this.deletePlatforms(platforms.key, this.uid)}>
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
              <th colSpan='2'>Platforms List</th>
            </tr>
            <tr>
              <th scope='col'>Name</th>
              <th scope='col'>Delete?</th>
            </tr>
          </thead>
          <tbody>
            {(this.state.platforms.length !== 0 && !this.state.isLoading) &&
              this.state.platforms.map((platforms) => this.renderPlatforms(platforms))
            }
          </tbody>
        </table>
        {this.state.isLoading && <p>Carregando, aguarde...</p>}
      </div>
    )
  }
  
}

const PlatformPage = (props) => 
  <AuthUserContext.Consumer>    
    { authUser => 
      <div className='container'>
        <h1>Platform Page</h1>
        <PlatformForm authUser={authUser} props={props}/>
      </div>
    }
  </AuthUserContext.Consumer>

const authCondition = (authUser) => !!authUser

export default withAuthorization(authCondition)(PlatformPage)