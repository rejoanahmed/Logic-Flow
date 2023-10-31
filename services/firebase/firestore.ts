import {
  addDoc,
  collection,
  doc,
  getFirestore,
  setDoc
} from 'firebase/firestore'
import app from '.'
const db = getFirestore(app)

// users / userid/ workspaces/ [] of workspaces
// workspaces / workspaceid / boards / [] of boards
const userPath = (uid: string) => `users/${uid}`
const userWorkspacesPath = (uid: string) => `${userPath(uid)}/workspaces`
const workspacePath = (uid: string) => `workspaces/${uid}/`

export const addWorkSpaceToUser = async (
  userId: string,
  name: string,
  email: string,
  photoURL: string
) => {
  try {
    const userDoc = doc(db, userPath(userId))
    await setDoc(
      userDoc,
      {
        name,
        email,
        photoURL
      },
      { merge: true }
    )

    const collectionRef = collection(db, userWorkspacesPath(userId))
    const docRef = await addDoc(collectionRef, {
      role: 'owner',
      members: [userId]
    })
    const workspaceId = docRef.id
    const workspaceDoc = doc(db, workspacePath(workspaceId))
    await setDoc(workspaceDoc, {
      name: 'Untitled Workspace',
      elements: [],
      members: [
        {
          id: userId,
          role: 'owner'
        }
      ]
    })
    return docRef
  } catch (error) {
    console.log(error)
  }
}

export const shareWorkspace = async (
  workspaceId: string,
  userId: string,
  role: 'editor' | 'viewer' = 'editor'
) => {
  try {
    const workspaceDoc = doc(db, workspacePath(workspaceId))
    await setDoc(
      workspaceDoc,
      {
        members: [
          {
            id: userId,
            role: role
          }
        ]
      },
      { merge: true }
    )
  } catch (error) {
    console.log(error)
  }
}

export default db
