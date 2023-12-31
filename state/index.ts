import { WorkspaceDoc } from '@/services/firebase/firestore'
import { User } from 'firebase/auth'
import { atom } from 'jotai'
import LogicBoard from 'lib/LogicBoardClass'

export const SidebarAtom = atom(true)
export const selectedToolAtom = atom('')
export const SelectModalAtom = atom({
  show: false,
  top: 0,
  left: 0,
  target: undefined as fabric.Object | undefined
})
export const spaceAtom = atom('')
export const shareModalAtom = atom<'dismissible' | undefined>(undefined)
export const UserAtom = atom<User | null | 'loading'>('loading')
export const WorkspaceAtom = atom<WorkspaceDoc | null>(null)
export const LogicBoardAtom = atom<LogicBoard | null>(null)
export const CanvasAtom = atom<fabric.Canvas | null>(null)
