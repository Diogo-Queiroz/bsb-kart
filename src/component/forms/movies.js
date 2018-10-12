import React, { Component } from 'react'
import AuthUserContext from '../auth-user-context'
import withAuthorization from '../withAuthorization'
import { firebase } from '../../firebase/firebase'
import { dbRef, dbMovieRef, onceGetMovies } from '../../firebase/database'
import { storageRef } from '../../firebase/storage'

class MovieForm extends Component {
  constructor (props) {
    super(props)
    
    this.state = {
      list: [],
      file: '',
      imagePreviewURL: '',
      error: ''
    }

    this.submitForm = this.submitForm.bind(this)
    this.loadPreview = this.loadPreview.bind(this)
  }

  submitForm (e) {
    /*if (!!img) {
      imgsRef.child(img.name).put(img).then((result) => {
        console.log('Uploaded -> ', result)
        console.log('bucket -> ', result.ref.bucket)
        console.log('fullPath -> ', result.ref.fullPath)
        let downloadPath = 'gs://'+result.ref.bucket+'/'+result.ref.fullPath
        console.log('download path', downloadPath)
        console.log('token', result.token)
        console.log('bytes transferred', result.bytesTransferred)
        console.log('metada', result.metadata)
        console.log('state', result.state)
        console.log('task', result.task)
        dbRef.child('movies').push(infos)
      }).catch((error) => {
        console.log('Error -> ', error)
        this.setState({
          error: 'Error'
        })
      })
    }*/
    e.preventDefault()
    this.setState({ error: '' })
    let Data = new Date()
    let img = this.state.file
    let imgUrl
    let key
    let infos = {
      date: Data.toLocaleDateString(),
      name: this.refs.name.value.trim(),
      category: this.refs.category.value.trim(),
      situation: this.refs.situation.value.trim(),
      comments: this.refs.comments.value.trim(),
      user: this.props.authUser.email,
      //imgUrl: downloadPath
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
                console.log('File avaliable at', downloadUrl)
                dbRef.child('movies/' + key).update({ imgUrl: downloadUrl })
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
    imgPreview.onloadend = () => {
      this.setState({
        file: file,
        imagePrevewURL: imgPreview.result
      })
    }
    imgPreview.readAsDataURL(file)
    console.log(e)
    console.log(e.target.files[0])
  }
  
  render () {
    const style = {
      colLabel: 'col-sm-3 col-form-label',
      colInput: 'col-sm-9'
    }
    
    return (
      <div>
        <form ref='form' onSubmit={this.submitForm}>
          <div className='form-group row'>
            <label htmlFor='name' className={style.colLabel}>Movie Name</label>
            <div className={style.colInput}>
              <input type='text' id='name' 
                className='form-control my-input-style' placeholder='name of the movie'
                required ref='name' />
            </div>
          </div>
          <div className='form-group row'>
            <label htmlFor='category' className={style.colLabel}>Category</label>
            <div className={style.colInput}>
              <select className='form-control my-input-style' id='category' required ref='category'>
                <option value='Action'>Action</option>
                <option value='Drama'>Drama</option>
              </select>
            </div>
          </div>
          <div className='form-group row'>
            <label htmlFor='situation' className={style.colLabel}>Situação:</label>
            <div className={style.colInput}>
              <select className='form-control my-input-style' id='situation' required ref='situation'>
                <option value='watched'>Assistido</option>
                <option value='to watch'>Assistir</option>
              </select>
            </div>
          </div>
          <div className='form-group row'>
            <label htmlFor='comments' className={style.colLabel}>Comments:</label>
            <div className={style.colInput}>
              <textarea className='form-control' id='comments' rows='4' ref='comments'></textarea>
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
    this.toogleMovieList = this.toogleMovieList.bind(this)
  }
  
  getMovieList () {
    let newMovies = []
    dbMovieRef.on('child_added', (snapshot) => {
      let data = snapshot.val()
      console.log(data)
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
  
  componentDidMount () {
    console.log('component did mount')
    onceGetMovies().then(snapshot => {
      this.setState({
        isLoading: true
      })
      let data = snapshot.val()
      let item = []
      console.log(data)
      console.log(typeof(data))
      console.log(Object.keys(data))
      Object.keys(data).forEach((key) => {
        console.log(key, data[key])
        item.push({
          name: data[key].name,
          category: data[key].category,
          situation: data[key].situation,
          comments: data[key].comments,
          imgUrl: (data[key].imgUrl) ? data[key].imgUrl : ''
        })
      })
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
    console.log(this.state.movieList)
  }
  
  componentWillUpdate () {
    console.log('component will update')
    console.log(this.state.movieList)
  }
  
  componentDidUpdate () {
    console.log('component did update')
  }
  
  componentWillMount () {
    console.log('component will mount')
  }
  
  toogleMovieList () {
    this.setState({
      visibleList: !this.state.visibleList
    })
  }
  
  renderMovies (movies) {
    return (
      <div key={movies.name} className='col-sm-12 col-md-6 col-lg-4 col-xl-3' style={{marginBottom: 10 + 'px'}}>
        <div key={movies.name} className="card">
          <img className="card-img-top" src={movies.imgUrl} alt="Card image cap" />
          <div className="card-body">
            <h5 className="card-title">{movies.name}</h5>
            <p className="card-text">{movies.comments}</p>
            <p className="card-text">{movies.category} - {movies.situation}</p>
            <div className='row'>
              <a href="#" className="btn btn-primary col">Edit</a>
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
        <button onClick={this.toogleMovieList}>Show/Hide MovieList</button>
        <button onClick={this.getMovieList}>Refresh</button>
      </div>
    )
  }
  
}

const MoviesPage = () =>
  <AuthUserContext.Consumer>    
    { authUser => 
      <div className='container'>
        <h1>Movies Page</h1>
        <div className='row'>
          <div className='col'></div>
          <div className='col-sm-12 col-md-8 col-lg-6'>
            <p>This page is only visible from signed in users</p>
            <MovieForm authUser={authUser}/>
          </div>
          <div className='col'></div>
        </div>
        <MovieList />
      </div>
    }
  </AuthUserContext.Consumer>

const authCondition = (authUser) => !!authUser

export default withAuthorization(authCondition)(MoviesPage)
