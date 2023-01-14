import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { ComponentProps } from 'react';
import { FiCheck } from 'react-icons/fi';

type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root> & {
  label: string
}

export const Checkbox = ({ label, ...props }: CheckboxProps) => {
  return (
    <label className="flex items-center gap-2 group text-gray-500 cursor-pointer text-sm">
      <CheckboxPrimitive.Root id={props.name} className="group-hover:border-primary transition-colors flex items-center justify-center w-5 h-5 rounded-md border overflow-hidden border-gray-200/80 bg-gray-100/50" {...props}>
        <CheckboxPrimitive.Indicator className="bg-primary w-full h-full flex items-center justify-center text-white">
          <FiCheck />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label}
    </label>
  )
}