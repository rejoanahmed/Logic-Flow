'use client'
import { atom, useAtom } from 'jotai'
import React, { useEffect } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import auth, { SigninWithGoogle, Signout } from '@/services/firebase/auth'
import AvatarStack from './AvatarStack'
import { Avatar } from 'flowbite-react'
import Link from 'next/link'
import { Dropdown } from 'flowbite-react'
import { NAVBAR_HEIGHT } from 'lib/constants'
import ShareModal from './ShareModal'
import { UserAtom } from '@/state'
import { useRouter } from 'next/router'

function Navabr() {
  const [user, setUser] = useAtom(UserAtom)
  const router = useRouter()
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
  }, [setUser])
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
    <nav
      className='flex px-10 justify-between items-center bg-gray-200'
      style={{ maxHeight: NAVBAR_HEIGHT, minHeight: NAVBAR_HEIGHT }}
    >
      <Link href={'/'} className='font-bold text-2xl tracking-tighter'>
        Logic <span className='text-orange-400'>Flow</span>
      </Link>
      <div className='flex items-center'>
        <AvatarStack />
        {!user || user === 'loading' ? (
          <button onClick={handleLogin} className=''>
            <span className='text-orange-600'>Login</span>
          </button>
        ) : (
          <>
            {router.pathname.includes('board') && <ShareModal />}
            <Dropdown
              label={
                <Avatar
                  key={user.uid}
                  img={user.photoURL as string}
                  alt={user.displayName as string}
                  size='sm'
                  rounded
                />
              }
              size={'sm'}
              style={{ height: '40px' }}
              dismissOnClick={false}
            >
              <Dropdown.Item>
                <Link href={`/user/${user.uid}`}>Profile</Link>
              </Dropdown.Item>
              <Dropdown.Item>Settings</Dropdown.Item>
              <Dropdown.Item>Earnings</Dropdown.Item>
              <Dropdown.Item onClick={Signout}>Sign out</Dropdown.Item>
            </Dropdown>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navabr
