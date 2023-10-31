import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where
} from 'firebase/firestore'
import app from '.'
import { ComponentSchema, InputSchema, WireSchema } from 'lib/LogicBoardClass'
const db = getFirestore(app)

export type UserDoc = {
  displayName: string
  email: string
  photoURL: string
  uid: string
}
export type WorkspaceMemberType = {
  role: 'owner' | 'editor' | 'viewer'
  joinedAt: Date
} & UserDoc

export type WorkspaceDoc = {
  uid: string
  name: string
  description: string
  elements: WireSchema | ComponentSchema | InputSchema[]
  memberIds: string[]
  members: WorkspaceMemberType[]
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

export const createNewWorkspace = async (
  userId: string,
  displayName: string,
  email: string,
  photoURL: string
) => {
  try {
    const collectionRef = collection(db, WORKSPACE_COLLECTION)
    const docRef = await addDoc(collectionRef, {
      name: 'Untitled Workspace',
      description: '',
      elements: [],
      memberIds: [userId],
      members: [
        {
          uid: userId,
          role: 'owner',
          joinedAt: new Date(),
          displayName,
          email,
          photoURL
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
  shareWith: UserDoc,
  role: 'editor' | 'viewer' = 'editor'
) => {
  try {
    const workspaceDoc = doc(db, workspacePath(workspaceId))
    const docSnap = await getDoc(workspaceDoc)
    if (docSnap.exists()) {
      console.log('exists')
      const prevMembers = docSnap.data()?.members || []
      const currentMemberRole = prevMembers.find((member: any) => {
        return member.uid === userId
      })
      console.log(currentMemberRole)
      if (!currentMemberRole) return
      if (currentMemberRole.role !== 'owner') return
      const newMembers = prevMembers.concat({
        ...shareWith,
        role,
        joinedAt: new Date()
      })
      const newMemberIds = newMembers.map((member: any) => member.uid)
      await setDoc(
        workspaceDoc,
        {
          members: newMembers,
          memberIds: newMemberIds
        },
        { merge: true }
      )
    }
  } catch (error) {
    console.log(error)
  }
}

export const getAllUsers = async () => {
  try {
    const docsSnapshot = await getDocs(collection(db, 'users'))
    const docs: UserDoc[] = []
    docsSnapshot.forEach((doc) => {
      docs.push({ uid: doc.id, ...(doc.data() as any) })
    })

    return docs as UserDoc[]
  } catch (error) {
    console.log(error)
  }
}

export const getUserWorkspaces = async (userId: string) => {
  try {
    const q = query(
      collection(db, WORKSPACE_COLLECTION),
      where('memberIds', 'array-contains', userId)
    )
    const docsSnapshot = await getDocs(q)
    const docs: WorkspaceDoc[] = []
    docsSnapshot.forEach((doc) => {
      docs.push({ uid: doc.id, ...(doc.data() as any) })
    })
    return docs as WorkspaceDoc[]
  } catch (error) {
    console.log(error)
  }
}

export const getWorkspace = async (workspaceId: string) => {
  try {
    const docRef = doc(db, workspacePath(workspaceId))
    const docSnap = await getDoc(docRef)
    return { uid: docSnap.id, ...docSnap.data() } as WorkspaceDoc
  } catch (error) {
    console.log(error)
  }
}

export default db
