import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import app from '.'

const auth = getAuth(app)

export const SigninWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  // const credential = GoogleAuthProvider.credentialFromResult(result)

  // const token = credential?.accessToken

  const user = result.user
  return user
}

export const Signout = async () => {
  await auth.signOut()
}

export default auth
