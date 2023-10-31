import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc
} from 'firebase/firestore'
import app from '.'
const db = getFirestore(app)

export type UserDoc = {
  displayName: string
  email: string
  photoURL: string
  uid: string
}

// users / userid/ workspaces/ [] of workspaces
// workspaces / workspaceid / boards / [] of boards
const WORKSPACE_COLLECTION = 'workspaces'
const userPath = (uid: string) => `users/${uid}`
const workspacePath = (uid: string) => `workspaces/${uid}/`

export const addUser = async (user: UserDoc) => {
  try {
    const docRef = await setDoc(doc(db, userPath(user.uid)), user)
    return docRef
  } catch (error) {
    console.log(error)
  }
}

export const addWorkSpaceToUser = async (userId: string) => {
  try {
    const collectionRef = collection(db, WORKSPACE_COLLECTION)
    const docRef = await addDoc(collectionRef, {
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

export const getAllUsers = async () => {
  try {
    const docsSnapshot = await getDocs(collection(db, 'users'))
    const docs: any[] = []
    docsSnapshot.forEach((doc) => {
      docs.push({ id: doc.id, ...doc.data() })
    })

    return docs as UserDoc[]
  } catch (error) {
    console.log(error)
  }
}

export const getUserWorkspaces = async (userId: string) => {
  try {
    const docsSnapshot = await getDocs(
      collection(db, userWorkspacesPath(userId))
    )
    const docs: any[] = []
    docsSnapshot.forEach((doc) => {
      docs.push({ id: doc.id, ...doc.data() })
    })

    return docs as {
      id: string
      role: string
      members: string[]
    }[]
  } catch (error) {
    console.log(error)
  }
}

export const getWorkspace = async (workspaceId: string) => {
  try {
    const docRef = doc(db, workspacePath(workspaceId))
    const docSnap = await getDoc(docRef)
    return { id: docSnap.id, ...docSnap.data() }
  } catch (error) {
    console.log(error)
  }
}

export default db
