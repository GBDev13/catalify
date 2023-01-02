import * as PopoverPrimitive from '@radix-ui/react-popover';
import { ComponentProps, ReactNode } from 'react';

type PopoverProps = ComponentProps<typeof PopoverPrimitive.Root> & {
  children: ReactNode
  content: ReactNode
}

export const Popover = ({ content, children, ...props }: PopoverProps) => {
  return (
    <PopoverPrimitive.Root {...props}>
      <PopoverPrimitive.Trigger asChild>
        {children}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content className="p-4 rounded-md shadow-md bg-slate-200">
          <PopoverPrimitive.Arrow  className="fill-slate-200"/>
          {content}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}