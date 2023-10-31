'use client'
import { useAtom, useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import React from 'react'
import { UserAtom } from './Navabr'
import { SigninWithGoogle } from '@/services/firebase/auth'
import { spaces } from '@/services/ably'
import dynamic from 'next/dynamic'
import { spaceAtom } from '@/state'
import { addWorkSpaceToUser } from '@/services/firebase/firestore'

function CreateWorkspaceButton() {
  const router = useRouter()
  const setSpaceId = useSetAtom(spaceAtom)
  const [user, setUser] = useAtom(UserAtom)
  const handleCreateWorkspace = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!user || user === 'loading') {
      const currentUser = await SigninWithGoogle()
      if (currentUser) {
        const workspace = await addWorkSpaceToUser(
          currentUser.uid,
          currentUser.displayName || 'surprise',
          currentUser.email!,
          currentUser.photoURL!
        )
        if (!workspace) return
        setUser(currentUser)
        const space = await spaces.get(workspace.id)
        const members = await space.enter({
          photoURL: currentUser.photoURL,
          name: currentUser.displayName
        })
        console.log(members)
        setSpaceId(workspace.id)
        console.log('routing')
        router.push(`/board?spaceId=${workspace.id}`)
      }
    } else {
      const workspace = await addWorkSpaceToUser(
        user.uid,
        user.displayName || 'surprise',
        user.email!,
        user.photoURL!
      )
      if (!workspace) return
      const space = await spaces.get(workspace.id)
      const members = await space.enter({
        photoURL: user.photoURL,
        name: user.displayName
      })
      console.log(members)
      setSpaceId(workspace.id)
      router.push(`/board?spaceId=${workspace.id}`)
    }
  }
  return (
    <button
      className='inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900'
      onClick={handleCreateWorkspace}
    >
      Create a workspace
      <svg
        className='ml-2 -mr-1 w-5 h-5'
        fill='currentColor'
        viewBox='0 0 20 20'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fillRule='evenodd'
          d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
          clipRule='evenodd'
        ></path>
      </svg>
    </button>
  )
}

export default dynamic(() => Promise.resolve(CreateWorkspaceButton), {
  ssr: false
}) as typeof CreateWorkspaceButton
