import { NextApiRequest, NextApiResponse } from "next"
import CryptoJS from 'crypto-js';

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

  try {
    const { path, secret: encryptedSecret } = req.body

  const decryptedToken = CryptoJS.AES.decrypt(encryptedSecret, process.env.NEXT_PUBLIC_REVALIDATE_TOKEN!).toString(CryptoJS.enc.Utf8);
  const data = JSON.parse(decryptedToken);

  // verifica se o token é válido (por exemplo, se o timestamp não é muito antigo e ainda não expirou)
  const now = new Date().getTime();
  if (now - data.timestamp > 30000 || now > data.expireTime) { // verifica se o token expirou
    res.status(401).send('Invalid token');
    return;
  }

  try {
    await res.revalidate(path)

    return res.status(200).json({ message: "OK" })
  } catch (err) {
    return res.status(400).send({
      message: `Failed to revalidate ${path}`
    })
  }
  } catch {
    return res.status(400).send({
      message: `Failed to revalidate`
    })
  }
}