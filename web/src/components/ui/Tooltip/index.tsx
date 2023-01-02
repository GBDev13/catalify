import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { fadeAnim } from 'src/lib/animations';

type TooltipProps = {
  children: ReactNode
  content: string
}

export const Tooltip = ({ content, children }: TooltipProps) => {
  const [open, setOpen] = useState(false);

  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root delayDuration={300} open={open} onOpenChange={setOpen}>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>

        <AnimatePresence>
          {open && (
            <TooltipPrimitive.Portal forceMount>
              <TooltipPrimitive.Content forceMount>
                <motion.div className="text-sm bg-slate-300 shadow py-1 px-2 rounded" {...fadeAnim} transition={{ duration: 0.15 }}>
                  <TooltipPrimitive.Arrow className="fill-slate-300" />
                  {content}
                </motion.div>
              </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
          )}
        </AnimatePresence>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}