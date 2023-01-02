import clsx from "clsx"

type DividerProps = {
  className?: string
}

export const Divider = ({ className }: DividerProps) => {
  return (
    <div className={clsx("h-[1px] w-full bg-slate-300 my-4 rounded", className)} />
  )
}