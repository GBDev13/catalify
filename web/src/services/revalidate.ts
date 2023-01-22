import axios from "axios"

export const revalidatePath = async (path: string) => {
  const { data } = await axios.post('/api/revalidate', {
    secret: process.env.NEXT_PUBLIC_REVALIDATE_TOKEN,
    path
  })

  return data
}