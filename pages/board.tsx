'use client'
import { ablyClient, spaces } from '@/services/ably'
import LogicBoard from '../components/Canvas/Board'
import { SpacesProvider, SpaceProvider } from '@ably/spaces/react'
import { AblyProvider } from 'ably/react'
import dynamic from 'next/dynamic'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useRouter } from 'next/router'
import { UserAtom, WorkspaceAtom, spaceAtom } from '@/state'
import { getWorkspace } from '@/services/firebase/firestore'
import { useEffect } from 'react'
import { SpaceEvents } from '@ably/spaces'

const listener = (stateChange: SpaceEvents.UpdateEvent) => {
  console.log(stateChange.members)
}

function BoardPage() {
  const spaceId = useAtomValue(spaceAtom)
  const setSpaceId = useSetAtom(spaceAtom)
  const router = useRouter()
  const [user, setUser] = useAtom(UserAtom)
  const setWorkspace = useSetAtom(WorkspaceAtom)

  useEffect(() => {
    if (spaceId) {
      getWorkspace(spaceId).then((workspace) => {
        if (!workspace) {
          router.replace('/', undefined, { shallow: true })
          return
        }
        setWorkspace(workspace)
      })
      user &&
        user !== 'loading' &&
        spaces.get(spaceId).then((space) => {
          space.enter({
            photoURL: user?.photoURL,
            displayName: user?.displayName
          })

          // subscribe to space updates
          space.subscribe('update', listener)
        })

      return () => {
        spaces.get(spaceId).then((space) => {
          console.log('leaving space')
          space.leave()
          space.unsubscribe('update', listener)
        })
      }
    }
  }, [spaceId, user])

  if (!spaceId) {
    if (router.query.spaceId) {
      const queriedSpaceId = router.query.spaceId as string
      setSpaceId(queriedSpaceId)
      return null
    }
    if (!user) {
      router.replace('/', undefined, { shallow: true })
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
