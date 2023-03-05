import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.body
  res.setHeader("Access-Control-Allow-Origin", "https://app.catalify.com.br");
  res.setHeader("Access-Control-Allow-Methods", "POST");

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