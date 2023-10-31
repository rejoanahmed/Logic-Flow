'use client'

import { Avatar } from 'flowbite-react'
import { useMembers } from '@ably/spaces/react'
import dynamic from 'next/dynamic'

function AvatarStack() {
  const { self, others, members } = useMembers()
  console.log(self, others, members)
  return (
    <div className='flex flex-wrap gap-2 ml-auto'>
      <Avatar.Group>
        {others.map((member) => (
          <Avatar
            key={member.clientId}
            img={member.profileData!.photoURL as string}
            alt={member.profileData!.name as string}
            size='sm'
            className='border-2 border-white'
          />
        ))}
      </Avatar.Group>
    </div>
  )
}
export default dynamic(() => Promise.resolve(AvatarStack), {
  ssr: false
}) as typeof AvatarStack
