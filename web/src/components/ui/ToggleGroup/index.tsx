import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import clsx from 'clsx';
import { ComponentProps } from 'react';
import { ErrorOption } from 'react-hook-form';

type ToggleGroupProps = ComponentProps<typeof ToggleGroupPrimitive.Root> & {
  options: {
    value: unknown;
    label: string;
  }[]
  label?: string
  error?: ErrorOption
}

export const ToggleGroup = ({ options, label, error, ...props }: ToggleGroupProps) => {
  const hasError = !!error;

  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-slate-500 mb-1">
          {label}
        </label>
      )}

      <ToggleGroupPrimitive.Root className="bg-slate-100 rounded-md overflow-hidden border-slate-200 h-[38px] flex" {...props}>
        {options.map(option => (
          <ToggleGroupPrimitive.Item key={option.value as string} value={option.value as string} className={
            clsx("flex-1 text-slate-400 text-sm border-l first:border-l-0 border-l-slate-300 transition-colors", {
              "text-indigo-500 bg-indigo-500/20": props.value === option.value,
              "hover:text-indigo-500": !props?.disabled,
              "!opacity-80 cursor-not-allowed": props?.disabled
            })
          }>
            {option.label}
          </ToggleGroupPrimitive.Item>
        ))}
      </ToggleGroupPrimitive.Root>

      {hasError && (
        <span className="text-red-400 text-xs mt-2">{error.message}</span>
      )}
    </div>
  )
}