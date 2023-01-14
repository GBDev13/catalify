
import clsx from 'clsx'
import { ComponentProps } from 'react'
import { ErrorOption } from 'react-hook-form'
import BasePhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

type PhoneInputProps = ComponentProps<typeof BasePhoneInput> & {
  label?: string
  error?: ErrorOption
}

export const PhoneInput = ({ label, error, ...props }: PhoneInputProps) => {
  const hasError = !!error;
  
  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-slate-500 mb-1">
          {label}
        </label>
      )}
      <BasePhoneInput
        placeholder="+ 55 (12) 999999999"
        {...props}
        inputClass={clsx({
          'error': hasError,
          'disabled': props.disabled
        })}
      />
      {hasError && (
        <span className="text-red-400 text-xs mt-2">{error.message}</span>
      )}
    </div>
  )
}