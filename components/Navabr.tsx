'use client'
import { atom, useAtom } from 'jotai'
import React from 'react'
import { User } from 'firebase/auth'
import { SigninWithGoogle } from '@/services/firebase/auth'
import AvatarStack from './AvatarStack'

export const UserAtom = atom<User | null | 'loading'>(null)
function Navabr() {
  const [user, setUser] = useAtom(UserAtom)
  const handleLogin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (user) return
    const currentUser = await SigninWithGoogle()
    if (currentUser) {
      setUser(currentUser)
    }
  }
  return (
    <nav className='flex px-10 py-4 bg-gray-200'>
      <h1 className='font-bold text-2xl tracking-tighter'>
        Logic <span className='text-purple-600'>Flow</span>
      </h1>
      <AvatarStack />
      {!user && (
        <button onClick={handleLogin} className='ml-auto'>
          <span className='text-purple-600'>Login</span>
        </button>
      )}
    </nav>
  )
}

export default Navabr
