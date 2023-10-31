import { WorkspaceDoc, getUserWorkspaces } from '@/services/firebase/firestore'
import { UserAtom } from '@/state'
import { Avatar } from 'flowbite-react'
import { useAtomValue } from 'jotai'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

function UserDashBoard() {
  const user = useAtomValue(UserAtom)
  const router = useRouter()
  const [boards, setBoards] = useState<WorkspaceDoc[]>([])
  useEffect(() => {
    user !== 'loading' &&
      user &&
      getUserWorkspaces(user.uid).then((boards) => {
        boards && setBoards(boards)
      })
  }, [user])
  if (!user) {
    router.replace('/')
    return
  }
  return (
    <div className='container mx-auto'>
      <Section boards={[]} title='Your Boards' />
      <Section boards={[]} title='shared With You' />
    </div>
  )
}

const Section = ({
  boards,
  title
}: {
  boards: {
    owner: string
    title: string
    description: string
    ownerPhoto: string
    id: string
  }[]
  title: string
}) => {
  const router = useRouter()
  const handleClick = (id: string) => {
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
            onClick={() => handleClick(board.id)}
          >
            <div className='flex gap-2 items-center bg-slate-500 -mx-4 -mt-4 rounded-t-md px-2 py-1 text-slate-200'>
              <Avatar img={board.ownerPhoto} size='sm' rounded />
              <p>{board.owner}</p>
            </div>
            <h3 className='text-lg font-semibold'>{board.title}</h3>
            <p className='text-sm'>{board.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
export default UserDashBoard
