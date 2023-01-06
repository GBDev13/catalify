import { ReactNode, useState } from 'react';
import { Select } from 'src/components/ui/Select';
import { VARIANT_MODELS } from 'src/constants/constants';
import { Popover } from '../../../../ui/Popover';

export type VariantModel = {
  name: string;
  options: string[];
}

type ModelSelectorContentProps = {
  onSelectModel: (model: VariantModel) => void
  onClose: () => void
}

type VariantModelSelectorPopoverProps = Omit<ModelSelectorContentProps, 'onClose'> & {
  children: ReactNode
}

const ModelSelectorContent = ({ onSelectModel, onClose }: ModelSelectorContentProps) => {
  const handleSelect = (value: any) => {
    const selected = VARIANT_MODELS.find(model => model.value === value.value)
    if (!selected) return;

    onSelectModel({
      name: selected.label,
      options: selected.options
    })
    onClose()
  }

  const options = VARIANT_MODELS.map(model => ({
    label: model.label,
    value: model.value
  }))

  return (
    <div className="min-w-[300px]">
      <label className="text-sm mb-1 text-slate-500" htmlFor="models">Modelos disponíveis</label>
      <Select options={options} inputId="models" onChange={handleSelect} />
    </div>
  )
}

export const VariantModelSelectorPopover = ({ onSelectModel, children }: VariantModelSelectorPopoverProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen} side="top" content={<ModelSelectorContent onClose={() => setOpen(false)} onSelectModel={onSelectModel} />} className="!bg-slate-200 border border-slate-300">
      {children}
    </Popover>
  )
}