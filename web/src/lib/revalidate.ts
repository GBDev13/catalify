import axios from "axios";

export async function revalidate(
  hostname: string, // hostname to be revalidated
  siteId: string, // siteId
  extraPath?: string // slugname for the post
) {
  const urlPaths = [`/_sites/${siteId}`];

  if(extraPath) {
    urlPaths.push(`/_sites/${siteId}/${extraPath}`);
  }

  // refer to https://solutions-on-demand-isr.vercel.app/ for more info on bulk/batch revalidate
  try {
    await Promise.all(
      urlPaths.map((path) =>
        axios.post(`${hostname}/api/revalidate`, {
          secret: process.env.NEXT_PUBLIC_REVALIDATE_TOKEN,
          path
        })
      )
    );
  } catch (err) {
    console.error(err);
  }
}