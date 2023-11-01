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

function BoardPage() {
  const spaceId = useAtomValue(spaceAtom)
  const setSpaceId = useSetAtom(spaceAtom)
  const router = useRouter()
  const [user, setUser] = useAtom(UserAtom)
  const setWorkspace = useSetAtom(WorkspaceAtom)

  useEffect(() => {
    if (user === 'loading') return
    if (spaceId) {
      user &&
        spaces.get(spaceId).then((space) => {
          space.enter({
            photoURL: user?.photoURL,
            displayName: user?.displayName
          })
        })
      setTimeout(
        () =>
          getWorkspace(spaceId).then((workspace) => {
            if (!workspace) {
              router.replace('/', undefined, { shallow: true })
              return
            }
            setWorkspace(workspace)
          }),
        1000
      )
    }
    if (!spaceId) {
      if (router.query.spaceId) {
        const queriedSpaceId = router.query.spaceId as string
        setSpaceId(queriedSpaceId)
      }
      if (!user) {
        router.replace('/', undefined, { shallow: true })
      }
    }
    return () => {
      user &&
        spaceId &&
        spaces.get(spaceId).then((space) => {
          space.leave()
          space.unsubscribe()
        })
    }
  }, [spaceId, user])

  if (user === 'loading') return <p>loading</p>
  if (!spaceId) return <p>no space id</p>

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
