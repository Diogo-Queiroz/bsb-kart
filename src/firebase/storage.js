import { storage } from './firebase'

export const storageRef = storage.ref()
export const imgsRef = storageRef.child('imagens/')