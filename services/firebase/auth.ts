import {
  GoogleAuthProvider,
  getAdditionalUserInfo,
  getAuth,
  signInWithPopup
} from 'firebase/auth'
import app from '.'
import { addUser } from './firestore'

const auth = getAuth(app)

export const SigninWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  const additionalUserInfo = getAdditionalUserInfo(result)
  if (additionalUserInfo?.isNewUser)
    await addUser({
      uid: result.user.uid,
      displayName: result.user.displayName || '',
      email: result.user.email || '',
      photoURL: result.user.photoURL || ''
    })

  const user = result.user
  return user
}

export const Signout = async () => {
  await auth.signOut()
}

export default auth
