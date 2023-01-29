import { ReactNode } from "react"
import { Dialog } from "."
import { Button } from "../Button"

type ConfirmationContentProps = {
  title: string
  description: string
  onConfirm: () => void
  onCancel: () => void
}

type ConfirmationDialogProps = ConfirmationContentProps & {
  children?: ReactNode
  show: boolean
}

const ConfirmationContent = ({ description, onCancel, onConfirm }: ConfirmationContentProps) => {
  return (
    <div className="flex flex-col text-center gap-6">
      <p className="text-slate-500">{description}</p>

      <div className="grid grid-cols-2 gap-4">
        <Button type="button" variant="OUTLINE" size="WIDE" onClick={onCancel}>Não</Button>
        <Button type="button" size="WIDE" onClick={onConfirm}>Sim</Button>
      </div>
    </div>
  )
}

export const ConfirmationDialog = ({ show, children, ...props }: ConfirmationDialogProps) => {
  return (
    <Dialog title={props.title} open={show} maxWidth="550px" content={<ConfirmationContent {...props} />}>
      {children && children}
    </Dialog>
  )
}