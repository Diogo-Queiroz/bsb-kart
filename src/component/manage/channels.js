import React, { Component } from 'react'
import {
  dbRef,
  deleteChannel,
  getUserChannel
} from '../../firebase/database'
import AuthUserContext from '../auth-user-context'
import withAuthorization from '../withAuthorization'

const byProperKey = (propertyName, value) => () => ({
  [propertyName]: value
})

const INITIAL_STATE = {
  channel: '',
  refreshList: false,
  channels: [],
  isLoading: false,
  isUploading: false
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
    let channelName = this.refs.channel.value.trim()
    let id = this.props.authUser.uid
    console.log(this.props.authUser)
    console.log(channelName)
    dbRef.child(`channels/${id}`).push({name: channelName})
      .then((data) => {
        console.log(data.key)
        this.setState({
          refreshList: !this.state.refreshList,
          channel: ''
        })
      })
  }

  render () {
    const { isUploading } = this.state

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
              <label htmlFor='channel' className={style.colLabel}>Channel Name</label>
              <div className={style.colInput}>
                <input type='text' id='channel'
                  className='form-control my-input-style'
                  placeholder='Channel name'
                  value={this.state.channel}
                  onChange={event => this.setState(
                    byProperKey('channel', event.target.value)
                  )}
                  required ref='channel' />
              </div>
            </div>
            
            <div className='form-group'>
              <div className='row justify-content-around'>
                <button
                  type='submit'
                  className='btn btn-primary btn-lg'
                  disabled={isUploading}>
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
          <ChannelsList authUser={this.props.authUser} refreshList={this.state.refreshList} />
        </div>
        <div className='col-md-2 col-lg-3'></div>
      </div>
    )
  }
}

class ChannelsList extends Component {
  constructor (props) {
    super(props)
    
    this.state = { ...INITIAL_STATE }
  }

  uid = this.props.authUser.uid

  getUserChannels (id) {
    getUserChannel(id)
      .then((result) => {
        console.log('get user Channels', result.val())
        this.setState({
          isLoading: true
        })
        let data = result.val()
        let channel = []
        Object.keys(data).map((item) => {
          console.log(data[item].name)
          channel.push({
            key: item,
            name: data[item].name
          })
        })
        this.setState({
          isLoading: false,
          channels: channel
        })
      })
      .catch(error => console.log(error))
  }

  deleteChannel (id, userId) {
    console.log('delete channel', id)
    deleteChannel(id, userId)
      .then(() => {
        console.log(`channel deleted from user ${this.uid}, ${id}`)
        this.getUserChannels(this.uid)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  componentDidMount () {
    this.getUserChannels(this.uid)
  }
  
  componentWillReceiveProps (props) {
    const refreshList = this.props.refreshList
    if (props.refreshList !== refreshList) {
      this.getUserChannels(this.uid)
    }
  }

  renderChannels (channels) {
    console.log('render Channels', channels)
    return (
      <tr key={channels.key}>
        <td>{channels.name}</td>
        <td>
          <button
            className='btn btn-default'
            onClick={() => this.deleteChannel(channels.key, this.uid)}>
              Deletar
          </button>
        </td>
      </tr>
    )
  }

  render () {
    return (
      <div>
        {this.state.isLoading && <p>Carregando, aguarde...</p>}
        <table className='table table-hover table-sm'>
          <thead className='thead-light'>
            <tr>
              <th colSpan='2'>Channels List</th>
            </tr>
            <tr>
              <th scope='col'>Name</th>
              <th scope='col'>Delete?</th>
            </tr>
          </thead>
          <tbody>
            {(this.state.channels.length !== 0 && !this.state.isLoading) &&
              this.state.channels.map((channels) => this.renderChannels(channels))
            }
          </tbody>
        </table>
      </div>
    )
  }
  
}

const ChannelsPage = (props) => 
  <AuthUserContext.Consumer>    
    { authUser => 
      <div className='container'>
        <h1>Channels Page</h1>
        <SituationForm authUser={authUser} props={props}/>
      </div>
    }
  </AuthUserContext.Consumer>

const authCondition = (authUser) => !!authUser

export default withAuthorization(authCondition)(ChannelsPage)