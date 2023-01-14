import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ComponentProps, ReactNode } from 'react';
import { FiXCircle } from 'react-icons/fi';

type DialogProps = ComponentProps<typeof DialogPrimitive.Root> & {
  children: ReactNode
  content: ReactNode
  maxWidth?: string
  title?: string
}

export const CatalogDialog = ({ children, content, title, maxWidth, ...props }: DialogProps) => {
  return (
    <DialogPrimitive.Root {...props}>
      <DialogPrimitive.Trigger asChild>
        {children}
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="backdrop-blur-sm absolute inset-0 bg-gray-700/60 z-30" />
        <DialogPrimitive.Content className="p-4 rounded-md z-40 bg-gray-100 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full" style={{ maxWidth: maxWidth ? maxWidth : undefined}}>
          <header className="flex items-center mb-6">
            {title && <DialogPrimitive.Title className="text-2xl font-semibold text-gray-600">{title}</DialogPrimitive.Title>}
            <DialogPrimitive.Close className="ml-auto text-gray-800 hover:text-primary transition-colors">
              <FiXCircle size={18} />
            </DialogPrimitive.Close>
          </header>

          {content}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}