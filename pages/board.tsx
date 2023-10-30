'use client'
import { ablyClient, spaces } from '@/services/ably'
import LogicBoard from '../components/Canvas/Board'
import { SpacesProvider, SpaceProvider } from '@ably/spaces/react'
import { AblyProvider, useAbly, useConnectionStateListener } from 'ably/react'

function BoardPage() {
  return (
    <AblyProvider client={ablyClient}>
      <SpacesProvider client={spaces}>
        <SpaceProvider name='my-space'>
          <LogicBoard />
        </SpaceProvider>
      </SpacesProvider>
    </AblyProvider>
  )
}

export default BoardPage
