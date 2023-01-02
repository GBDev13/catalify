import { AxiosError } from "axios"
import toast from "react-hot-toast"

type NotifyTypes = "success" | "error" | "promise" 

type PromiseOptions = {
  function: () => Promise<any>
  options: {
    loading: string
    success: string
    error: string
  }
}

export const notify = (type: NotifyTypes, message: unknown, promiseOptions?: PromiseOptions) => {
  switch(type) {
    case "promise":
      if(!promiseOptions) return
      toast.promise(promiseOptions.function(), promiseOptions.options)
      break
    case 'error':
      let errMessage = message
      if(message instanceof AxiosError) {
        errMessage = (message.response?.data as any)?.message ?? 'Ocorreu um erro inesperado, tente novamente.'
      }
      toast.error(String(errMessage))
      break
    default:
      toast[type](String(message))
  }

}
