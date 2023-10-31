import type { NextApiRequest, NextApiResponse } from 'next'
import * as Ably from 'ably/promises'
type ResponseData = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (!process.env.ABLY_API_KEY) {
    return res.status(500).json({
      message: `Missing ABLY_API_KEY environment variable.
        If you're running locally, please ensure you have a ./.env file with a value for ABLY_API_KEY=your-key.
        If you're running in Netlify, make sure you've configured env variable ABLY_API_KEY.
        Please see README.md for more details on configuring your Ably API Key.`
    })
  }

  const clientId =
    req.body.clientId || process.env.DEFAULT_CLIENT_ID || 'NO_CLIENT_ID'
  const client = new Ably.Rest(process.env.ABLY_API_KEY)
  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: clientId
  })
  console.log('what the f', tokenRequestData)
  res.status(200).json({ message: 'Hello from Next.js!' })
}
