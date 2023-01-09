import { useFormContext } from "react-hook-form"
import { FaTrash } from "react-icons/fa"
import { Button } from "src/components/ui/Button"
import { Input } from "src/components/ui/Input"
import { BannerFormData } from "."

type BannerItemProps = {
  field: {
    id: string
    image: File
  }
  fieldIndex: number
  onRemove: (index: number) => void
}

export const BannerItem = ({ field, fieldIndex, onRemove }: BannerItemProps) => {
  const imageUrl = URL.createObjectURL(field.image)

  const { register, formState: { errors }} = useFormContext<BannerFormData>()

  return (
    <div className="flex flex-col gap-4 ">
      <img src={imageUrl} className="w-full h-[160px] rounded object-contain bg-slate-100/50" alt={`Banner ${fieldIndex}`} />
      <div className="flex items-start gap-2 w-full">
        <Input
          className="flex-1 h-full"
          placeholder="Link de redirecionamento (opcional)"
          error={errors.banners?.[fieldIndex]?.link}
          {...register(`banners.${fieldIndex}.link`)}
        />
        <Button type="button" onClick={() => onRemove(fieldIndex)} size="WIDE" className="min-h-0 w-[38px] h-[38px] !p-0" variant="OUTLINE">
          <FaTrash size={18} />
        </Button>
      </div>
    </div>
  )
}