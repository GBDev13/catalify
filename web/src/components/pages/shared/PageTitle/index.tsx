import { ReactNode } from "react"

type PageTitleProps = {
  title: string
  children?: ReactNode
}

export const PageTitle = ({ title, children }: PageTitleProps) => {
  return (
    <header className="flex items-center justify-between border-b border-slate-300 pb-6 mb-6">
      <div className="flex items-center gap-2">
        <div className="h-5 min-w-[20px] bg-indigo-500 rounded-md" />
        <h1 className="font-semibold text-2xl md:text-4xl">{title}</h1>
      </div>

      {children && children}
    </header>
  )
}