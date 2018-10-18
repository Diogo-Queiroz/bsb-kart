import React, { Component } from 'react'
import {
  dbRef,
  deleteProgress,
  getUserProgress
} from '../../firebase/database'
import AuthUserContext from '../auth-user-context'
import withAuthorization from '../withAuthorization'

const byProperKey = (propertyName, value) => () => ({
  [propertyName]: value
})

const INITIAL_STATE = {
  progress: '',
  refreshList: false,
  progresses: [],
  isLoading: false
}

class ProgressForm extends Component {
  constructor (props) {
    super (props)

    this.state = { ...INITIAL_STATE }

    this.submitForm = this.submitForm.bind(this)
  }

  submitForm (e) {
    e.preventDefault()
    console.log('submiting')
    let progressName = this.refs.progress.value.trim()
    let id = this.props.authUser.uid
    console.log(this.props.authUser)
    console.log(progressName)
    dbRef.child(`progresses/${id}`).push({name: progressName})
      .then((data) => {
        console.log(data.key)
        this.setState({
          refreshList: !this.state.refreshList,
          progress: ''
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
              <label htmlFor='progress' className={style.colLabel}>Progress Name</label>
              <div className={style.colInput}>
                <input type='text' id='progress'
                  className='form-control my-input-style'
                  placeholder='Progress name'
                  value={this.state.progress}
                  onChange={event => this.setState(
                    byProperKey('progress', event.target.value)
                  )}
                  required ref='progress' />
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
          <ProgressList authUser={this.props.authUser} refreshList={this.state.refreshList} />
        </div>
        <div className='col-md-2 col-lg-3'></div>
      </div>
    )
  }
}

class ProgressList extends Component {
  constructor (props) {
    super(props)
    
    this.state = { ...INITIAL_STATE }
  }

  uid = this.props.authUser.uid

  getUserProgress (id) {
    getUserProgress(id)
      .then((result) => {
        console.log('get user progress', result.val())
        this.setState({
          isLoading: true
        })
        let data = result.val()
        let progress = []
        Object.keys(data).map((item) => {
          console.log(data[item].name)
          progress.push({
            key: item,
            name: data[item].name
          })
        })
        this.setState({
          isLoading: false,
          progresses: progress
        })
      })
      .catch(error => console.log(error))
  }

  deleteProgress (id, userId) {
    console.log('delete progress', id)
    deleteProgress(id, userId)
      .then(() => {
        console.log(`progress deleted from user ${this.uid}, ${id}`)
        this.getUserProgress(this.uid)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  componentDidMount () {
    this.getUserProgress(this.uid)
  }
  
  componentWillReceiveProps (props) {
    const refreshList = this.props.refreshList
    if (props.refreshList !== refreshList) {
      this.getUserProgress(this.uid)
    }
  }

  renderProgresses (progresses) {
    console.log('render progresses', progresses)
    return (
      <tr key={progresses.key}>
        <td>{progresses.name}</td>
        <td>
          <button
            className='btn btn-default'
            onClick={() => this.deleteProgress(progresses.key, this.uid)}>
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
              <th colSpan='2'>Progresses List</th>
            </tr>
            <tr>
              <th scope='col'>Name</th>
              <th scope='col'>Delete?</th>
            </tr>
          </thead>
          <tbody>
            {(this.state.progresses.length !== 0 && !this.state.isLoading) &&
              this.state.progresses.map((progresses) => this.renderProgresses(progresses))
            }
          </tbody>
        </table>
        {this.state.isLoading && <p>Carregando, aguarde...</p>}
      </div>
    )
  }
  
}

const ProgressPage = (props) => 
  <AuthUserContext.Consumer>    
    { authUser => 
      <div className='container'>
        <h1>Progress Page</h1>
        <ProgressForm authUser={authUser} props={props}/>
      </div>
    }
  </AuthUserContext.Consumer>

const authCondition = (authUser) => !!authUser

export default withAuthorization(authCondition)(ProgressPage)