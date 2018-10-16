import { database } from './firebase'

export const dbRef = database.ref()
export const dbMovieRef = database.ref('/movies')
export const onceGetMovies = () => dbMovieRef.once('value')
export const getCurrentMovie = (id) => database.ref('/movies/'+id).once('value')
export const deleteMovie = (id) => database.ref('/movies/'+id).remove()

export const categoryRef = database.ref('/categories')
export const getCategories = () => database.ref('categories').once('value')
export const getSituations = () => database.ref('situations').once('value')