import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({ 
    method: req.method,
    body: req.body
   })
}