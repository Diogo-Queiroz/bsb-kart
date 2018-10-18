import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import AuthUserContext from '../auth-user-context'
import withAuthorization from '../withAuthorization'
import { storageRef } from '../../firebase/storage'
import { 
  dbRef,
  dbMovieRef,
  onceGetMovies,
  getCurrentMovie,
  deleteMovie
} from '../../firebase/database'
import * as routes from '../../constants/routes'


const byProperKey = (propertyName, value) => () => ({
  [propertyName]: value
})

const INITIAL_STATE = {
  name: '',
  category: '',
  situation: '',
  channel: '',
  comments: '',
  list: [],
  file: '',
  imagePrevewURL: '',
  error: '',
  refreshList: false,
  isLoading: false,
  movieList: [],
  visibleList: false
}

class UpdateMovieForm extends Component {
  constructor (props) {
    super(props)
    
    this.state = { ...INITIAL_STATE }

    this.submitForm = this.submitForm.bind(this)
    this.loadPreview = this.loadPreview.bind(this)
  }

  submitForm (e) {
    const { history } = this.props
    
    console.log('submit form')
    e.preventDefault()
    this.setState({ error: '' })
    let Data = new Date()
    let img = this.state.file
    let key
    let infos = {
      date: Data.toLocaleDateString(),
      name: this.refs.name.value.trim(),
      category: this.refs.category.value.trim(),
      situation: this.refs.situation.value.trim(),
      comments: this.refs.comments.value.trim(),
      user: this.props.authUser.email
    }
    dbRef.child('movies').push(infos)
      .then((data) => {
        key = data.key
        return key
      })
      .then(key => {
        const extension = img.name.slice(img.name.lastIndexOf('.'))
        let uploadTask = storageRef.child('movie-img/' + key + extension).put(img)
        uploadTask.on('state_changed', (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log('upload is ' + progress + '% done')
          }, (error) => {
            console.log(error)
          }, () => {
            uploadTask.snapshot.ref.getDownloadURL()
              .then((downloadUrl) => {
                dbRef.child('movies/' + key).update({ imgUrl: downloadUrl })
                this.refs.name.value = ''
                this.refs.category.value = ''
                this.refs.situation.value = ''
                this.refs.comments.value = ''
                this.setState({
                  file: '',
                  imagePreviewURL: '',
                  refreshList: !this.state.refreshList
                })
                history.push(routes.MOVIES)
              })
          })
      })
      .catch((error) => {
        console.log(error)
      })
  }
  
  loadPreview (e) {
    console.log('load preview')
    e.preventDefault()
    let imgPreview = new FileReader()
    let file = e.target.files[0]
    if (!file) {
      return
    }
    imgPreview.onloadend = () => {
      this.setState({
        file: file,
        imagePrevewURL: imgPreview.result
      })
    }
    imgPreview.readAsDataURL(file)
  }
  
  componentDidMount () {
    const { search } = this.props.props.location
    let id = search.slice(search.indexOf('=') + 1, search.length)
    console.log('state', this.state)
    console.log('this.props', this.props)
    console.log('this.props.props', this.props.props)
    console.log('this.props.props.location', this.props.props.location)
    console.log('this.props.props.location.search', this.props.props.location.search)
    console.log('this.props.props.location.search slice method', search.slice(search.indexOf('=') + 1, search.length))
    getCurrentMovie(id)
      .then(snapshot => {
        console.log(snapshot.val())
        let data = snapshot.val()
        this.refs.name.value = data.name
        this.refs.category.value = data.category
        this.refs.comments.value = data.comments
        this.refs.situation.value = data.situation
        this.refs.channel.value = data.channel
        //this.refs.imgFile.value = data.imgUrl
      })
      .catch(error => console.log(error))
  }

  submitUpdateForm () {
    const { history } = this.props
    console.log('updating')
    history.push(routes.MOVIES)
  }

  render () {
    const {
      name,
      category,
      situation,
      channel,
      isUploading,
      comments,
      imagePrevewURL,
      refreshList
    } = this.state
    
    const { 
      authUser
    } = this.props
    
    const style = {
      colLabel: 'col-sm-3 col-form-label',
      colInput: 'col-sm-9'
    }
    console.log('render')
    this.isUpdating
    
    return (
      <div className='row'>
          <div className='col'></div>
          <div className='col-sm-12 col-md-8 col-lg-6'>
            <p>This page is only visible from signed in users</p>
            <form ref='form' onSubmit={this.submitUpdateForm}>
              <div className='form-group row'>
                <label htmlFor='name' className={style.colLabel}>Movie Name</label>
                <div className={style.colInput}>
                  <input type='text' id='name' 
                    className='form-control my-input-style'
                    placeholder='name of the movie'
                    value={name} 
                    onChange={event => this.setState(
                      byProperKey('name', event.target.value)
                    )}
                    required ref='name' />
                </div>
              </div>
              <div className='form-group row'>
                <label htmlFor='category' className={style.colLabel}>Category</label>
                <div className={style.colInput}>
                  <select className='form-control my-input-style' id='category' required ref='category'>
                    {!!category && console.log('render categorias', category)}
                    {category && category.map((item) => (
                        <option key={item.key} value={item.name}>{item.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className='form-group row'>
                <label htmlFor='situation' className={style.colLabel}>Situação:</label>
                <div className={style.colInput}>
                  <select className='form-control my-input-style' id='situation' required ref='situation'>
                    {!!situation && console.log('render situações', situation)}
                    {situation && situation.map((item) => (
                        <option key={item.key} value={item.name}>{item.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='form-group row'>
                <label htmlFor='channel' className={style.colLabel}>Canal:</label>
                <div className={style.colInput}>
                  <select className='form-control my-input-style' id='situation' required ref='channel'>
                    {!!channel && console.log('render channels', channel)}
                    {channel && channel.map((item) => (
                        <option key={item.key} value={item.name}>{item.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className='form-group row'>
                <label htmlFor='comments' className={style.colLabel}>Comments:</label>
                <div className={style.colInput}>
                  <textarea 
                    className='form-control'
                    id='comments'
                    rows='4'
                    ref='comments'
                    value={comments}
                    onChange={event => this.setState(
                      byProperKey('comments', event.target.value)
                    )}></textarea>
                </div>
              </div>
              
              <div className='form-group row'>
                <label htmlFor='selectFile' className={style.colLabel}>Select File</label>
                <div className={style.colInput}>
                  <input type='file' id='output' onChange={(e) => this.loadPreview(e)} ref='imgFile' required/>
                  {!!this.state.file && 
                    <img id='output' src={imagePrevewURL} className='img-thumbnail' />
                  }
                </div>
              </div>
              
              <div className='form-group'>
                <div className='row justify-content-around'>
                  <button type='submit'
                    className='btn btn-success btn-lg'>
                      Update
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
          <div className='col'></div>
      </div>
    )
  }
}

const UpdateMoviePage = (props) => 
  <AuthUserContext.Consumer>    
    { authUser => 
      <div className='container'>
        <h1>Update Movie Page</h1>
        <UpdateMovieForm authUser={authUser} props={props}/>
      </div>
    }
  </AuthUserContext.Consumer>

const authCondition = (authUser) => !!authUser

export default withAuthorization(authCondition)(UpdateMoviePage)
