import React, { Component } from 'react'
import AuthUserContext from '../auth-user-context'
import withAuthorization from '../withAuthorization'
import { storageRef } from '../../firebase/storage'
import { 
  dbRef,
  dbMovieRef,
  onceGetMovies,
  getCurrentMovie
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
  refreshList: false
}

class MovieForm extends Component {
  constructor (props) {
    super(props)
    
    this.state = {
      ...INITIAL_STATE
    }

    this.submitForm = this.submitForm.bind(this)
    this.loadPreview = this.loadPreview.bind(this)
  }

  submitForm (e) {
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
                //console.log('File avaliable at', downloadUrl)
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
              })
          })
      })
      .catch((error) => {
        console.log(error)
      })
  }
  
  loadPreview (e) {
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
  
  componentDidMount () {
    console.log('component did mount')
    console.log(this.props)
    console.log(this.props.location)
    // console.log(this.props.location.search)   props.location.search
  }

  componentWillMount () {
    const query = this.props.props.location.search
    console.log(query)
    const id = query.slice(query.indexOf('=') + 1, query.length)
    console.log(id)
    getCurrentMovie(id)
      .then((snapshot) => {
        console.log(snapshot.val())
        const movie = snapshot.val()
        this.setState({
          name: movie.name,
          comments: movie.comments
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render () {
    const style = {
      colLabel: 'col-sm-3 col-form-label',
      colInput: 'col-sm-9'
    }
    console.log('render')
    console.log(this.props)
    console.log(this.props.location)
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
                    value={this.state.name} 
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
                    <option value=''>Select a category</option>
                    <option value='Action'>Action</option>
                    <option value='Drama'>Drama</option>
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
                    value={this.state.comments}
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
                    <img id='output' src={this.state.imagePrevewURL} className='img-thumbnail' />
                  }
                </div>
              </div>
              
              <div className='form-group'>
                <div className='row justify-content-md-around'>
                  <button type='submit' className='btn btn-primary btn-lg col'>Submit</button>
                  <button type='reset' className='btn btn-danger btn-lg col'>Cancel</button>
                </div>
              </div>
              {!!this.state.error && <p>Erro, tente novamente...</p>}
            </form>
          </div>
          <div className='col'></div>
        <MovieList authUser={this.props.authUser} refreshList={this.state.refreshList}/>
      </div>
    )
  }
}

class MovieList extends Component {
  constructor (props) {
    super(props)
    
    this.state = {
      isLoading: false,
      movieList: [],
      visibleList: false
    }
    this.getMovieList = this.getMovieList.bind(this)
    this.getUserMovieList = this.getUserMovieList.bind(this)
  }
  
  getMovieList () {
    let newMovies = []
    dbMovieRef.on('child_added', (snapshot) => {
      let data = snapshot.val()
      //console.log(data)
      let item = {
        name: data.name,
        category: data.category,
        date: data.date,
        situation: data.situation,
        comments: data.comments,
        imgUrl: data.imgUrl
      }
      newMovies.push(item)
    })
    this.setState({
      movieList: newMovies
    })
  }
  
  getUserMovieList (obj) {
    onceGetMovies().then(snapshot => {
      this.setState({
        isLoading: true
      })
      let data = snapshot.val()
      let item = []
      Object.keys(data).forEach((key) => {
        //console.log(key, data[key])
        //console.log(key, data[key].user)
        //console.log(this.props.authUser.email)
        //console.log('são iguais?? ', data[key].user === this.props.authUser.email)
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

  componentDidMount () {
    //console.log('component did mount')
    this.getUserMovieList()
  }
  
  componentWillReceiveProps (props) {
    //console.log('Component will receive this props -> ', props)
    const refreshList = this.props.refreshList
    if (props.refreshList !== refreshList) {
      this.getUserMovieList()
    }
  }
  
  renderMovies (movies) {
    //console.log(movies)
    return (
      <div key={movies.key} className='col-sm-12 col-md-6 col-lg-4 col-xl-3' style={{marginBottom: 10 + 'px'}}>
        <div key={movies.name} className="card">
          <img className="card-img-top card-img-size" src={movies.imgUrl} alt="Card image cap" />
          <div className="card-body">
            <h5 className="card-title">{movies.name}</h5>
            <p className="card-text">{movies.comments}</p>
            <p className="card-text">{movies.category} - {movies.situation}</p>
            <div className='row'>
              <a href={'/movies/?id=' + movies.key} className="btn btn-primary col">Edit</a>
              <a href="#" className="btn btn-danger col">Delete</a>
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
            this.state.movieList.map(this.renderMovies)
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
