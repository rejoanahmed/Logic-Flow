import { getFirestore } from 'firebase/firestore'
import app from '.'
const db = getFirestore(app)

// users / userid/ workspaces/ [] of workspaces
// workspaces / workspaceid / boards / [] of boards

export const addWorkSpaceToUser = async (
  userId: string,
  workspaceId: string
) => {}

export default db
