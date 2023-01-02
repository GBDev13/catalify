import { ButtonHTMLAttributes } from "react"

type PaginationButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export const PaginationButton = ({ children, ...props }: PaginationButtonProps) => {
  return (
    <button className="flex items-center justify-center w-7 h-7 rounded border border-slate-200 text-indigo-500 hover:border-indigo-500 transition-all cursor-pointer disabled:opacity-90 disabled:text-slate-200 disabled:hover:border-slate-200" {...props}>
      {children}
    </button>
  )
}