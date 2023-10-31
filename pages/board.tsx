'use client'
import { ablyClient, spaces } from '@/services/ably'
import LogicBoard from '../components/Canvas/Board'
import { SpacesProvider, SpaceProvider } from '@ably/spaces/react'
import { AblyProvider } from 'ably/react'
import dynamic from 'next/dynamic'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useRouter } from 'next/router'
import { UserAtom } from 'components/Navabr'
import { spaceAtom } from '@/state'
import { uid } from 'lib/functions'

function BoardPage() {
  const spaceId = useAtomValue(spaceAtom)
  const setSpaceId = useSetAtom(spaceAtom)
  const router = useRouter()
  const [user, setUser] = useAtom(UserAtom)

  if (!spaceId) {
    if (router.query.spaceId) {
      const queriedSpaceId = router.query.spaceId as string
      setSpaceId(queriedSpaceId)
      return null
    }
    if (!user) {
      router.replace('/board?demo=true', undefined, { shallow: true })
      const generatedSpaceId = uid.randomUUID()
      setSpaceId(generatedSpaceId)
      return null
    }
  }
  return (
    <AblyProvider client={ablyClient}>
      <SpacesProvider client={spaces}>
        <SpaceProvider name={spaceId || 'demo'}>
          <LogicBoard />
        </SpaceProvider>
      </SpacesProvider>
    </AblyProvider>
  )
}

export default dynamic(() => Promise.resolve(BoardPage), {
  ssr: false
})
