import clsx from "clsx"
import Link from "next/link"
import { Button } from "src/components/ui/Button"
import { Dialog } from "src/components/ui/Dialog"

export type FeatureExplanation = {
  title: string
  description: string
  videoUrl?: string
}

type SubscriptionRequiredDialogProps = {
  open: FeatureExplanation | null
  setOpen: (open: FeatureExplanation | null) => void
}

type FeatureExplanationProps = {
  explanation: FeatureExplanation | null
  onClose: () => void
}

const FeatureExplanation = ({ explanation, onClose }: FeatureExplanationProps) => {
  return (
    <div>
      <h2 className="font-semibold text-indigo-500 text-xl mb-2">{explanation?.title}</h2>
      <p className="font-light text-slate-600">{explanation?.description}</p>

      <p className="my-4 text-slate-600 text-center sm:px-14">
        Essa e outras incríveis funcionalidades estão disponíveis para você na versão <span className="text-indigo-500">premium do Catalify</span>.
      </p>

      <div className={clsx("grid grid-cols-1 gap-2", {
        "grid-cols-2": explanation?.videoUrl,
      })}>
        {explanation?.videoUrl && (
          <a href={explanation.videoUrl} target="_blank" rel="noreferrer">
            <Button variant="OUTLINE" size="WIDE">Vídeo demonstrativo</Button>
          </a>
        )}
        <Link href="/dashboard/plans" onClick={onClose}>
          <Button size="WIDE">
            Assinar Premium
          </Button>
        </Link>
      </div>
    </div>
  )
}

export const SubscriptionRequiredDialog = ({ open, setOpen }: SubscriptionRequiredDialogProps) => {
  return (
    <Dialog title="Funcionalidade Premium" content={<FeatureExplanation onClose={() => setOpen(null)} explanation={open} />} open={!!open} maxWidth="700px" onOpenChange={(value) => {
      if (!value) setOpen(null)
    }} />
  )

}