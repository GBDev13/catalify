import { forwardRef, useEffect, useState } from "react"
import { ErrorOption } from "react-hook-form";
import clsx from 'clsx'
import * as Popover from '@radix-ui/react-popover';
import { CiPalette } from 'react-icons/ci'
import { makeColors } from "../../../helpers/make-colors";
import { Button } from "../Button";
import { ChromePicker } from 'react-color'

type InputProps = {
  error?: ErrorOption
  label?: string
  onChange: (value: string) => void
  value: string
}

export const ColorPicker = forwardRef<HTMLInputElement, InputProps>(({ label, error, onChange, value, ...props }, ref) => {
  const hasError = !!error;

  const availableColors = makeColors()

  const [open, setOpen] = useState(false)

  const handleSelectColor = (color: string, close = true) => {
    onChange(color)
    if(close) setOpen(false)
  }

  const selectedColor = value

  const [colorType, setColorType] = useState<'theme' | 'custom'>('theme')

  const handleToggleColorType = () => {
    setColorType(colorType === 'theme' ? 'custom' : 'theme')
  }

  const [selectedColorPicker, setSelectedColorPicker] = useState('')

  useEffect(() => {
    if(colorType === 'theme') {
      setSelectedColorPicker(selectedColor)
    }
  }, [colorType, selectedColor, value])

  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-slate-500 mb-1">
          {label}
        </label>
      )}

      <div
        className={clsx("w-full rounded-md border-slate-200 min-h-[38px] flex items-center justify-between px-3 sm:text-sm bg-slate-100 focus:border-indigo-500 transition-colors placeholder:text-slate-400", {
          "border-red-400": hasError,
        })}
        {...props}
        ref={ref}
      >
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded" style={{ background: selectedColor }} />
          <span>{selectedColor}</span>
        </div>

        <Popover.Root onOpenChange={setOpen} open={open}>
          <Popover.Trigger>
            <CiPalette size={20} />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content sideOffset={10} className="bg-white rounded p-2 shadow-md min-w-[245px] max-h-[300px] overflow-y-auto grid grid-cols-[repeat(10,1fr)] gap-1">
              <Popover.Arrow className="fill-white" />

              <Button type="button" className="col-span-full text-sm min-h-0 mb-2" size="WIDE" onClick={handleToggleColorType}>
                {colorType === 'custom' ? 'Cor pré-definida' : 'Cor personalizada'}
              </Button>

              {colorType === 'theme' && availableColors.map(color => (
                <button onClick={() => handleSelectColor(color)} key={color} className={clsx("w-4 h-4 rounded", {
                  "ring-2 ring-indigo-500": selectedColor === color
                })} style={{ background: color }} />
              ))}

              {colorType === 'custom' && (
                <div className="col-span-full">
                  <ChromePicker disableAlpha className="!shadow-none" color={selectedColorPicker} onChange={(color) => setSelectedColorPicker(color.hex)} onChangeComplete={(color) => handleSelectColor(color.hex, false)} />
                </div>
              )}

            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>

      {hasError && (
        <span className="text-red-400 text-xs mt-2">{error.message}</span>
      )}
    </div>
  )
})

ColorPicker.displayName = "ColorPicker"