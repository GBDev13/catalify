import { forwardRef, InputHTMLAttributes, useState } from "react"
import { ErrorOption } from "react-hook-form";
import clsx from 'clsx'
import { HiOutlineEyeOff, HiOutlineEye } from 'react-icons/hi'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: ErrorOption
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ type = 'text', className, label, id, error, ...props }, ref) => {
  const hasError = !!error;

  const isPassword = type === 'password'

  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={className ? className : undefined}>
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-slate-500 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
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