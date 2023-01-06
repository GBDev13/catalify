import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { ComponentProps } from 'react';
import { ErrorOption } from 'react-hook-form';
import { FiCheck } from 'react-icons/fi';

type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root> & {
  label: string
  error?: ErrorOption
}

export const Checkbox = ({ label, error, ...props }: CheckboxProps) => {
  const hasError = !!error;
  
  return (
    <div>
      <div className="flex items-center gap-2 group">
        <CheckboxPrimitive.Root id={props.name} className="group-hover:border-indigo-500 transition-colors flex items-center justify-center w-5 h-5 rounded-md border overflow-hidden border-slate-300 bg-slate-100" {...props}>
          <CheckboxPrimitive.Indicator className="bg-indigo-500 w-full h-full flex items-center justify-center text-white">
            <FiCheck />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        <label className="text-slate-500 cursor-pointer text-sm" htmlFor={props.name}>{label}</label>
      </div>

      {hasError && (
        <span className="text-red-400 text-xs mt-2">{error.message}</span>
      )}
    </div>
  )
}