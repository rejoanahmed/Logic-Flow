import { Realtime } from 'ably'
// import Spaces from '@ably/spaces'

export const ablyClient = new Realtime.Promise({
  authUrl: '/token',
  authMethod: 'POST'
})

// export const spaces = new Spaces(ablyClient)
