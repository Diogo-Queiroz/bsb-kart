import { database } from './firebase'

export const dbRef = database.ref()
export const dbMovieRef = database.ref('/movies')
export const onceGetMovies = () => database.ref('/movies').once('value')
export const getCurrentMovie = (id) => database.ref('/movies/'+id).once('value')