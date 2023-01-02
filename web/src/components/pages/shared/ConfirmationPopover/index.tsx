import { ReactNode, useState } from "react"
import { Button } from "src/components/ui/Button"
import { Popover } from "src/components/ui/Popover"

type ConfirmationContentProps = {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

type ConfirmationPopoverProps = Omit<ConfirmationContentProps, 'onCancel'> & {
  children: ReactNode
}

const ConfirmationContent = ({ message, onConfirm, onCancel }: ConfirmationContentProps) => {
  return (
    <div className="max-w-[200px]">
      <p className="text-xs text-center mb-2">{message}</p>

      <div className="grid grid-cols-2 gap-1">
        <Button size="WIDE" className="text-sm min-h-0 py-1.5" variant="OUTLINE" onClick={onCancel}>Cancelar</Button>
        <Button size="WIDE" className="text-sm min-h-0 py-1.5" onClick={onConfirm}>Confirmar</Button>
      </div>
    </div>
  )
}

export const ConfirmationPopover = ({ children, ...props }: ConfirmationPopoverProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen} content={<ConfirmationContent onCancel={() => setOpen(false)} {...props} />}>
      {children}
    </Popover>
  )
}