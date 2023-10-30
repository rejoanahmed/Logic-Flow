'use client'

import { Avatar } from 'flowbite-react'
// import { useMembers } from '@ably/spaces/react'

export default function AvatarStack() {
  // const { self, others, members } = useMembers()

  return (
    <div className='flex flex-wrap gap-2 ml-auto'>
      <Avatar.Group>
        <Avatar img='https://i.pravatar.cc/300?img=1' rounded stacked />
        <Avatar img='https://i.pravatar.cc/300?img=2' rounded stacked />
        <Avatar img='https://i.pravatar.cc/300?img=3' rounded stacked />
        <Avatar img='https://i.pravatar.cc/300?img=4' rounded stacked />
        <Avatar img='https://i.pravatar.cc/300?img=5' rounded stacked />
      </Avatar.Group>
    </div>
  )
}
