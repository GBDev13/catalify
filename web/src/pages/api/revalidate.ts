import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const { path } = req.body

  if (req.body.secret !== process.env.NEXT_PUBLIC_REVALIDATE_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    await res.revalidate(path)

    return res.status(200).json({ message: "OK" })
  } catch (err) {
    return res.status(500).send({
      message: `Failed to revalidate ${path}`
    })
  }
}