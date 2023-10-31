import { atom } from 'jotai'

export const SidebarAtom = atom(true)
export const selectedToolAtom = atom('')
export const SelectModalAtom = atom({
  show: false,
  top: 0,
  left: 0,
  target: undefined as fabric.Object | undefined
})
export const spaceAtom = atom('')
