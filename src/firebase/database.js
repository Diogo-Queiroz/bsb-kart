import { db } from './firebase'

export const dbRef = db.ref()
export const dbMovieRef = db.ref('/movies')