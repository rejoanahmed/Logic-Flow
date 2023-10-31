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
const userWorkspacesPath = (uid: string) => `users/${uid}/workspaces`
const workspacePath = (uid: string) => `workspaces/${uid}/`

export const addWorkSpaceToUser = async (userId: string) => {
  try {
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

export default db
