import { spaces } from '@/services/ably'
import { WorkspaceDoc, getUserWorkspaces } from '@/services/firebase/firestore'
import { UserAtom } from '@/state'
import { Avatar } from 'flowbite-react'
import { useAtomValue } from 'jotai'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

function UserDashBoard() {
  const user = useAtomValue(UserAtom)
  const router = useRouter()
  const [ownedBoards, setOwnedBoards] = useState<WorkspaceDoc[]>([])
  const [sharedBoards, setSharedBoards] = useState<WorkspaceDoc[]>([])
  useEffect(() => {
    user !== 'loading' &&
      user &&
      getUserWorkspaces(user.uid).then((boards) => {
        if (boards) {
          const ownedBoards = boards.filter((b) =>
            b.members.find((m) => m.role === 'owner' && m.uid === user.uid)
          )
          const sharedBoards = boards.filter(
            (b) =>
              !b.members.find((m) => m.role === 'owner' && m.uid === user.uid)
          )
          setOwnedBoards(ownedBoards)
          setSharedBoards(sharedBoards)
        }
      })
  }, [user])
  if (!user) {
    typeof window !== 'undefined' && router.replace('/')
    return
  }
  return (
    <div className='container mx-auto'>
      <Section boards={ownedBoards} title='Your Boards' />
      <Section boards={sharedBoards} title='shared With You' />
    </div>
  )
}

const Section = ({
  boards,
  title
}: {
  boards: WorkspaceDoc[]
  title: string
}) => {
  const router = useRouter()
  const user = useAtomValue(UserAtom)
  if (!user) {
    router.replace('/')
    return null
  }

  if (user === 'loading') return null

  const handleClick = async (id: string) => {
    const space = await spaces.get(id)
    const members = await space.enter({
      photoURL: user.photoURL,
      name: user.displayName
    })
    router.push(`/board?spaceId=${id}`)
  }
  return (
    <div className=''>
      <h2 className='text-2xl font-bold my-4'>{title}</h2>
      <div className='flex flex-wrap gap-4 cursor-pointer'>
        {boards.map((board, i) => (
          <div
            className='flex basis-56 border rounded-lg p-4 flex-shrink-0 flex-col gap-2'
            key={i}
            onClick={() => handleClick(board.uid)}
          >
            <div className='flex gap-2 items-center bg-slate-500 -mx-4 -mt-4 rounded-t-md px-2 py-1 text-slate-200'>
              <Avatar
                img={board.members.find((m) => m.role === 'owner')?.photoURL}
                size='sm'
                rounded
              />
              <p>
                {board.members.find((m) => m.role === 'owner')?.displayName}
              </p>
            </div>
            <h3 className='text-lg font-semibold'>{board.name}</h3>
            <p className='text-sm'>{board.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
export default UserDashBoard
