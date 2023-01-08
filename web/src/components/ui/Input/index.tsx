import { forwardRef, InputHTMLAttributes, useState } from "react"
import { ErrorOption } from "react-hook-form";
import clsx from 'clsx'
import { HiOutlineEyeOff, HiOutlineEye } from 'react-icons/hi'
import { Tooltip } from "../Tooltip";
import { BsQuestionCircle } from "react-icons/bs";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  tip?: string
  error?: ErrorOption
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ type = 'text', className, label, tip, name, error, ...props }, ref) => {
  const hasError = !!error;

  const isPassword = type === 'password'

  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={className ? className : undefined}>
      {label && (
        <label htmlFor={name} className="flex gap-1.5 text-xs font-medium text-slate-500 mb-1">
          {label}
          {tip && (
            <Tooltip content={tip} maxWidth={290}>
              <div>
                <BsQuestionCircle size={15} />
              </div>
            </Tooltip>
          )}
        </label>
      )}

      <div className="relative">
        <input
          id={name}
          name={name}
          className={clsx("w-full rounded-md border-slate-200 sm:text-sm bg-slate-100 focus:border-indigo-500 transition-colors placeholder:text-slate-400", {
            "border-red-400": hasError,
            "pr-8": isPassword
          })}
          type={isPassword ? showPassword ? 'text' : 'password' : type}
          {...props}
          ref={ref}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 leading-[0px] text-slate-500 hover:text-slate-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
          </button>
        )}
      </div>

      {hasError && (
        <span className="text-red-400 text-xs mt-2">{error.message}</span>
      )}
    </div>
  )
})

Input.displayName = "Input"