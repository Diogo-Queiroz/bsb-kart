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
  deleteMovie,
  getCategories,
  getUserCategory,
  getSituations
} from '../../firebase/database'

const byProperKey = (propertyName, value) => () => ({
  [propertyName]: value
})

const INITIAL_STATE = {
  name: '',
  category: '',
  situation: '',
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
                this.refs.name.value = ''
                this.refs.category.value = ''
                this.refs.situation.value = ''
                this.refs.comments.value = ''
                this.setState({
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
    /*getCategories().then(snapshot => {
      this.setState({
        isLoading: true
      })
      let data = snapshot.val()
      let category = [{
        key: '0',
        name: 'Select Category'
      }]
      Object.keys(data).forEach((key) => {
        console.log('data[key]', data[key].name)
        console.log('key', key)
        console.log('data', data)
        category.push({
          key: key,
          name: data[key].name
        })
      })
      this.setState({
        isLoading: false,
        category: category
      })
    }).catch(error => {
      console.log(error)
    })*/
  }

  componentDidMount () {
    console.log('did mount')
    this.getCategories(this.userId)
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
    
    console.log('render()', category)
    console.log('render')
    
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
                    {/*!!this.state.category && Object.keys(this.state.category).map((index) => {
                      //console.log('inside map', this.state.category[index].name)
                      <option value={this.state.category[index].name}>{this.state.category[index].name}</option>
                    })*/
                      category && category.map((item, index) => (
                        <option key={item.key} value={item.name}>{item.name}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
              <div className='form-group row'>
                <label htmlFor='situation' className={style.colLabel}>Situação:</label>
                <div className={style.colInput}>
                  <select className='form-control my-input-style' id='situation' required ref='situation'>
                    <option value=''>Select the status</option>
                    <option value='watched'>Assistido</option>
                    <option value='to watch'>Assistir</option>
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
                    <img id='output' src={imagePrevewURL} className='img-thumbnail' />
                  }
                </div>
              </div>
              
              <div className='form-group'>
                <div className='row justify-content-md-around'>
                  <button 
                    type='submit'
                    className='btn btn-primary btn-lg col'
                    disabled={isUploading}>
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
          <img className="card-img-top card-img-size" src={movies.imgUrl} alt="Card image cap" />
          <div className="card-body">
            <h5 className="card-title">{movies.name}</h5>
            <p className="card-text">{movies.comments}</p>
            <p className="card-text">{movies.category} - {movies.situation}</p>
            <div className='row'>
              <Link to={'/movies/?id=' + movies.key}
                className="btn btn-primary col">
                  Edit
              </Link>
              <a
                onClick={() => this.deleteCurrentMovie(movies.key)}
                className="btn btn-danger col">
                  Delete
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
