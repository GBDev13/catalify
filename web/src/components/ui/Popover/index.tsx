import * as PopoverPrimitive from '@radix-ui/react-popover';
import clsx from 'clsx';
import { ComponentProps, ReactNode } from 'react';

type PopoverProps = ComponentProps<typeof PopoverPrimitive.Root> & {
  children: ReactNode
  content: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left',
  className?: string
}

export const Popover = ({ content, children, side, className, ...props }: PopoverProps) => {
  return (
    <PopoverPrimitive.Root {...props}>
      <PopoverPrimitive.Trigger asChild>
        {children}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content side={side} className={clsx("p-4 rounded-md shadow-md bg-slate-200 !z-[999] focus:outline-none", className)}>
          <PopoverPrimitive.Arrow  className="fill-slate-200"/>
          {content}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}