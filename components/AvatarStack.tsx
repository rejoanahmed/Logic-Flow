'use client'

import { spaces } from '@/services/ably'
import { spaceAtom } from '@/state'
import { SpaceMember } from '@ably/spaces'
import { Avatar } from 'flowbite-react'
import { useAtomValue } from 'jotai'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

function AvatarStack() {
  const [others, setOthers] = useState<SpaceMember[]>([])
  const spaceId = useAtomValue(spaceAtom)
  useEffect(() => {
    const f = async () => {
      if (!spaceId) return
      const space = await spaces.get(spaceId)
      if (!space) return

      const othersMemberInfo = await space.members.getOthers()
      setOthers(othersMemberInfo.filter((m) => m.isConnected))
      space.members.subscribe(async (member) => {
        const otherMembers = await space.members.getOthers()
        setOthers(otherMembers.filter((m) => m.isConnected))
      })
    }
    f()
    return () => {}
  }, [spaceId])

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
