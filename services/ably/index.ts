import { Realtime } from 'ably'
import Spaces from '@ably/spaces'

export const ablyClient = new Realtime.Promise({
  key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
  clientId: process.env.NEXT_PUBLIC_DEFAULT_CLIENT_ID || 'NO_CLIENT_ID'
})

export const spaces = new Spaces(ablyClient)
