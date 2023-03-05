import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "https://app.catalify.com.br");
  res.setHeader("Access-Control-Allow-Methods", "POST");

  if(req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  if (req.body.secret !== process.env.NEXT_PUBLIC_REVALIDATE_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    await res.revalidate(req.body.path)
    return res.json({ revalidated: true })
  } catch (err) {
    return res.status(500).send('Error revalidating')
  }
}