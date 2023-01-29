import clsx from 'clsx'
import LogoSvg from 'public/images/logo.svg'
import { HTMLAttributes } from 'react'

type LogoProps = HTMLAttributes<SVGElement> 

export const Logo = ({ className, ...props }: LogoProps) => {
  return (
    <LogoSvg className={clsx("text-slate-100 w-[100px]", className)} {...props} />
  )
}