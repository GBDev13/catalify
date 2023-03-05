import axios from "axios";
import CryptoJS from 'crypto-js';
import { LOCALHOST_URL } from "src/constants/config";

export async function revalidate(
  hostname: string, // hostname to be revalidated
  siteId: string, // siteId
  extraPath?: string // slugname for the post
) {
  const urlPaths = [`/_sites/${siteId}`];

  if(extraPath) {
    urlPaths.push(`/_sites/${siteId}/${extraPath}`);
  }

  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify({
    timestamp: new Date().getTime(),
    expireTime: new Date().getTime() + 30000
  }), process.env.NEXT_PUBLIC_REVALIDATE_TOKEN!).toString();

  const host = process.env.NODE_ENV === 'development' ? `http://${siteId}.${LOCALHOST_URL}` : hostname

  // refer to https://solutions-on-demand-isr.vercel.app/ for more info on bulk/batch revalidate
  try {
    await Promise.all(
      urlPaths.map((path) =>
        axios.post(`${host}/api/revalidate`, {
          secret: encryptedData,
          path
        })
      )
    );
  } catch (err) {
    console.error(err);
  }
}