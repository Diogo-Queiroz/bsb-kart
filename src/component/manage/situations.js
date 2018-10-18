import React, { Component } from 'react'
import {
  dbRef,
  deleteSituation,
  getUserSituation
} from '../../firebase/database'
import AuthUserContext from '../auth-user-context'
import withAuthorization from '../withAuthorization'

const byProperKey = (propertyName, value) => () => ({
  [propertyName]: value
})

const INITIAL_STATE = {
  situation: '',
  refreshList: false,
  situations: [],
  isLoading: false
}

class SituationForm extends Component {
  constructor (props) {
    super (props)

    this.state = { ...INITIAL_STATE }

    this.submitForm = this.submitForm.bind(this)
  }

  submitForm (e) {
    e.preventDefault()
    console.log('submiting')
    let situationName = this.refs.situation.value.trim()
    let id = this.props.authUser.uid
    console.log(this.props.authUser)
    console.log(situationName)
    dbRef.child(`situations/${id}`).push({name: situationName})
      .then((data) => {
        console.log(data.key)
        this.setState({
          refreshList: !this.state.refreshList,
          situation: ''
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
              <label htmlFor='situation' className={style.colLabel}>Situation Name</label>
              <div className={style.colInput}>
                <input type='text' id='situation'
                  className='form-control my-input-style'
                  placeholder='Situation name'
                  value={this.state.situation}
                  onChange={event => this.setState(
                    byProperKey('situation', event.target.value)
                  )}
                  required ref='situation' />
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
          <SituationsList authUser={this.props.authUser} refreshList={this.state.refreshList} />
        </div>
        <div className='col-md-2 col-lg-3'></div>
      </div>
    )
  }
}

class SituationsList extends Component {
  constructor (props) {
    super(props)
    
    this.state = { ...INITIAL_STATE }
  }

  uid = this.props.authUser.uid

  getUserSituations (id) {
    getUserSituation(id)
      .then((result) => {
        console.log('get user situations', result.val())
        this.setState({
          isLoading: true
        })
        let data = result.val()
        let situation = []
        Object.keys(data).map((item) => {
          console.log(data[item].name)
          situation.push({
            key: item,
            name: data[item].name
          })
        })
        this.setState({
          isLoading: false,
          situations: situation
        })
      })
      .catch(error => console.log(error))
  }

  deleteSituation (id, userId) {
    console.log('delete situation', id)
    deleteSituation(id, userId)
      .then(() => {
        console.log(`situation deleted from user ${this.uid}, ${id}`)
        this.getUserSituations(this.uid)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  componentDidMount () {
    this.getUserSituations(this.uid)
  }
  
  componentWillReceiveProps (props) {
    const refreshList = this.props.refreshList
    if (props.refreshList !== refreshList) {
      this.getUserSituations(this.uid)
    }
  }

  renderSituations (situations) {
    console.log('render situations', situations)
    return (
      <tr key={situations.key}>
        <td>{situations.name}</td>
        <td>
          <button
            className='btn btn-default'
            onClick={() => this.deleteSituation(situations.key, this.uid)}>
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
              <th colSpan='2'>Situations List</th>
            </tr>
            <tr>
              <th scope='col'>Name</th>
              <th scope='col'>Delete?</th>
            </tr>
          </thead>
          <tbody>
            {(this.state.situations.length !== 0 && !this.state.isLoading) &&
              this.state.situations.map((situations) => this.renderSituations(situations))
            }
          </tbody>
        </table>
        {this.state.isLoading && <p>Carregando, aguarde...</p>}
      </div>
    )
  }
  
}

const SituationsPage = (props) => 
  <AuthUserContext.Consumer>    
    { authUser => 
      <div className='container'>
        <h1>Situations Page</h1>
        <SituationForm authUser={authUser} props={props}/>
      </div>
    }
  </AuthUserContext.Consumer>

const authCondition = (authUser) => !!authUser

export default withAuthorization(authCondition)(SituationsPage)