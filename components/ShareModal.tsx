'use client'
import React, { useEffect, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { UserAtom, WorkspaceAtom, shareModalAtom, spaceAtom } from '@/state'
import { Avatar, Button, Label, Modal, TextInput } from 'flowbite-react'
import { Share } from 'node_modules/lucide-react'
import {
  UserDoc,
  getAllUsers,
  shareWorkspace
} from '@/services/firebase/firestore'

function ShareModal() {
  const [openModal, setOpenModal] = useAtom(shareModalAtom)
  const space = useAtomValue(spaceAtom)
  console.log(space)
  const user = useAtomValue(UserAtom)
  const [users, setUsers] = useState<UserDoc[]>([])
  const [email, setEmail] = useState('')
  const currentWorkspace = useAtomValue(WorkspaceAtom)
  useEffect(() => {
    getAllUsers().then((users) => {
      setUsers(users || [])
    })
  }, [])
  if (!space || !user || user === 'loading' || !currentWorkspace) return null
  const owner = currentWorkspace.members.find(
    (m) => m.uid === user.uid && m.role === 'owner'
  )
  if (!owner) return null
  return (
    <>
      <Button
        onClick={() => setOpenModal('dismissible')}
        className='bg-slate-400 hover:bg-slate-500 mr-2'
      >
        <Share size={18} />
      </Button>
      <Modal
        dismissible
        size={'sm'}
        show={openModal === 'dismissible'}
        onClose={() => setOpenModal(undefined)}
      >
        <Modal.Header>Share with others</Modal.Header>
        <Modal.Body className='relative pt-0'>
          <form className='max-w-md flex-col sticky top-0 bg-white py-2'>
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='email1' value='Email' />
              </div>
              <TextInput
                id='email1'
                placeholder='name@flowbite.com'
                required
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </form>
          <div className='flex flex-col gap-2'>
            {users
              .filter((u) => u.uid !== user.uid)
              .map((v) => (
                <div className='flex gap-2' key={v.uid}>
                  <div className='flex flex-grow items-center gap-2 px-4 py-2 rounded-md bg-slate-500 text-slate-200'>
                    <Avatar img={v.photoURL} size='sm' rounded />
                    <p>{v.displayName}</p>
                  </div>
                  <Button
                    onClick={() =>
                      shareWorkspace(space, user.uid, {
                        photoURL: v.photoURL,
                        displayName: v.displayName,
                        uid: v.uid,
                        email: v.email
                      })
                    }
                    className='bg-slate-400 hover:bg-slate-500'
                  >
                    <Share size={18} />
                  </Button>
                </div>
              ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ShareModal
