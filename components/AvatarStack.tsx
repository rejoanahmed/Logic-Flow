'use client'

import { spaces } from '@/services/ably'
import { spaceAtom } from '@/state'
import { Space, SpaceMember } from '@ably/spaces'
import { Avatar } from 'flowbite-react'
import { useAtomValue } from 'jotai'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

function AvatarStack() {
  // const { self, others, members } = useMembers() ?buggy
  const spaceId = useAtomValue(spaceAtom)
  const [others, setOthers] = useState<SpaceMember[]>([])
  useEffect(() => {
    const f = async () => {
      if (!spaceId) return
      const space = await spaces.get(spaceId)
      space.members.subscribe(async (members) => {
        const otherMembers = await space.members.getOthers()
        console.log(otherMembers)
        setOthers(otherMembers)
      })
    }
    f()
    return () => {
      // unsubscribing to all events occur when board page is left
    }
  }, [])
  console.log(others)
  return (
    <div className='flex flex-wrap'>
      <Avatar.Group className='mr-2'>
        {others.map((member) => (
          <Avatar
            key={member.connectionId}
            rounded
            img={member.profileData!.photoURL as string}
            alt={member.profileData!.displayName as string}
            size='sm'
            stacked
          />
        ))}
      </Avatar.Group>
    </div>
  )
}
export default dynamic(() => Promise.resolve(AvatarStack), {
  ssr: false
}) as typeof AvatarStack
