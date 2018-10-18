import { database } from './firebase'

export const doCreateUser = (id, username, email) => database.ref(`users/${id}`).set({
  username, email
})
export const getCurrentUser = (id) => database.ref(`users/${id}`).once('value')

export const dbRef = database.ref()
export const dbMovieRef = database.ref('/movies')
export const onceGetMovies = () => dbMovieRef.once('value')
export const getCurrentMovie = (id) => database.ref('/movies/'+id).once('value')
export const deleteMovie = (id) => database.ref('/movies/'+id).remove()

export const categoryRef = database.ref('/categories')

export const getCategories = () => database.ref('categories').once('value')
export const getUserCategory = (id) => database.ref(`/categories/${id}`).once('value')
export const deleteCategory = (id, userId) => database.ref(`categories/${userId}/${id}`).remove()

export const getUserSituation = (id) => database.ref(`/situations/${id}`).once('value')
export const deleteSituation = (id, userId) => database.ref(`situations/${userId}/${id}`).remove()

export const getUserChannel = (id) => database.ref(`/channels/${id}`).once('value')
export const deleteChannel = (id, userId) => database.ref(`channels/${userId}/${id}`).remove()

export const getUserPlatform = (id) => database.ref(`/platforms/${id}`).once('value')
export const deletePlatform = (id, userId) => database.ref(`platforms/${userId}/${id}`).remove()

export const getUserProgress = (id) => database.ref(`/progresses/${id}`).once('value')
export const deleteProgress = (id, userId) => database.ref(`progresses/${userId}/${id}`).remove()