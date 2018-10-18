import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import AuthUserContext from '../auth-user-context'
import withAuthorization from '../withAuthorization'
import { storageRef } from '../../firebase/storage'
import { 
  dbRef,
  onceGetMovies,
  deleteMovie,
  getUserCategory,
  getUserSituation,
  getUserChannel
} from '../../firebase/database'

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
  isUploading: false,
  movieList: [],
  visibleList: false
}

class MovieForm extends Component {
  constructor (props) {
    super(props)
    
    this.state = { ...INITIAL_STATE }

    this.submitForm = this.submitForm.bind(this)
    this.loadPreview = this.loadPreview.bind(this)
    this.getCategories = this.getCategories.bind(this)
    this.getSituations = this.getSituations.bind(this)
  }

  userId = this.props.authUser.uid

  submitForm (e) {
    console.log('submit form')
    e.preventDefault()
    this.setState({ error: '', isUploading: true })
    let Data = new Date()
    let img = this.state.file
    let key
    let infos = {
      date: Data.toLocaleDateString(),
      name: this.refs.name.value.trim(),
      category: this.refs.category.value.trim(),
      situation: this.refs.situation.value.trim(),
      channel: this.refs.channel.value.trim(),
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
                //console.log('File avaliable at', downloadUrl)
                dbRef.child('movies/' + key).update({ imgUrl: downloadUrl })
                this.refs.category.value = ''
                this.refs.situation.value = ''
                this.refs.channel.value = ''
                this.setState({
                  name: '',
                  comments: '',
                  file: '',
                  imagePreviewURL: '',
                  isUploading: false,
                  refreshList: !this.state.refreshList
                })
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
      //console.log('Operation canceled')
      return
    }
    imgPreview.onloadend = () => {
      this.setState({
        file: file,
        imagePrevewURL: imgPreview.result
      })
    }
    imgPreview.readAsDataURL(file)
    //console.log(e)
    //console.log(e.target.files[0])
  }
  
  
  getCategories (id) {
    console.log('get categories')
    getUserCategory(id)
      .then(snapshot => {
        this.setState({ isLoading: true })
        let data = snapshot.val()
        let category = [{
          key: '0',
          name: 'Select Category'
        }]
        console.log(data)
        Object.keys(data).map(key => {
          category.push({
            key: key,
            name: data[key].name
          })
        })
        this.setState({
          isLoading: false,
          category: category
        })
      })
      .catch(error => console.log(error))
  }

  getSituations (id) {
    console.log('get situations')
    getUserSituation(id)
      .then(snapshot => {
        this.setState({ isLoading: true })
        let data = snapshot.val()
        let situation = [{
          key: '0',
          name: 'Select Situation'
        }]
        console.log(data)
        Object.keys(data).map(key => {
          situation.push({
            key: key,
            name: data[key].name
          })
        })
        this.setState({
          isLoading: false,
          situation: situation
        })
      })
      .catch(error => console.log(error))
  }

  getChannels (id) {
    console.log('get channels')
    getUserChannel(id)
      .then(snapshot => {
        this.setState({ isLoading: true })
        let data = snapshot.val()
        let channel = [{
          key: '0',
          name: 'Select Channel'
        }]
        console.log(data)
        Object.keys(data).map(key => {
          channel.push({
            key: key,
            name: data[key].name
          })
        })
        this.setState({
          isLoading: false,
          channel: channel
        })
      })
      .catch(error => console.log(error))
  }

  componentDidMount () {
    console.log('did mount')
    this.getCategories(this.userId)
    this.getSituations(this.userId)
    this.getChannels(this.userId)
  }

  RenderForm () {
    <form>
      <input type='text' value='test'/>  
    </form>
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
    
    console.log('render cat()', category)
    console.log('render sit', situation)
    
    return (
      <div className='row'>
          <div className='col'></div>
          <div className='col-sm-12 col-md-8 col-lg-6'>
            <p>This page is only visible from signed in users</p>
            <form ref='form' onSubmit={this.submitForm}>
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
                  <input type='file' id='output' onChange={(e) => this.loadPreview(e)} ref='img-file' required/>
                  {!!this.state.file && 
                    <img id='output' src={imagePrevewURL} className='img-thumbnail' alt='preview img'/>
                  }
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
                      Cancel
                  </button>
                </div>
              </div>
              {!!this.state.error && <p>Erro, tente novamente...</p>}
              {isUploading && <p>Enviando, aguarde!</p>}
            </form>
          </div>
          <div className='col'></div>
        <MovieList authUser={authUser} refreshList={refreshList}/>
      </div>
    )
  }
}

class MovieList extends Component {
  constructor (props) {
    super(props)
    
    this.state = { ...INITIAL_STATE }

    this.getUserMovieList = this.getUserMovieList.bind(this)
    this.deleteCurrentMovie = this.deleteCurrentMovie.bind(this)
  }

  getUserMovieList () {
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
            channel: data[key].channel,
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
  }

  componentDidMount () {
    this.getUserMovieList()
  }
  
  componentWillReceiveProps (props) {
    const refreshList = this.props.refreshList
    if (props.refreshList !== refreshList) {
      this.getUserMovieList()
    }
  }

  renderMovies (movies) {
    return (
      <div key={movies.key} className='col-sm-12 col-md-6 col-lg-4 col-xl-3' style={{marginBottom: 10 + 'px'}}>
        <div key={movies.name} className="card">
          <img className="card-img-top card-img-size" src={movies.imgUrl} alt="Card cap" />
          <div className="card-body">
            <h5 className="card-title">{movies.name}</h5>
            <p className="card-text">{movies.comments}</p>
            <h6 className='card-text'>Canal - {movies.channel}</h6>
            <p className="card-text">{movies.category} - {movies.situation}</p>
            <div className='row justify-content-around'>
              <Link to={'/movies/?id=' + movies.key}
                className="btn btn-primary btn-lg">
                  Editar
              </Link>
              <a
                onClick={() => this.deleteCurrentMovie(movies.key)}
                className="btn btn-danger btn-lg">
                  Deletar
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render () {
    return (
      <div>
        MovieList
        {this.state.isLoading && <p>Carregando, aguarde...</p>}
        <div className='row'>
          {(this.state.movieList.length !== 0 && !this.state.isLoading) &&
            this.state.movieList.map((movies) => this.renderMovies(movies))
          }
        </div>
      </div>
    )
  }
  
}

const MoviesPage = (props) => 
  <AuthUserContext.Consumer>    
    { authUser => 
      <div className='container'>
        <h1>Movies Page</h1>
        <MovieForm authUser={authUser} props={props}/>
      </div>
    }
  </AuthUserContext.Consumer>

const authCondition = (authUser) => !!authUser

export default withAuthorization(authCondition)(MoviesPage)
