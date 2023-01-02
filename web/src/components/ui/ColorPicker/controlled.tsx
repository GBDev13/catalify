import { ComponentProps } from 'react'
import { Controller } from 'react-hook-form'
import { ColorPicker } from '.'

type ControlledInputProps = Omit<ComponentProps<typeof ColorPicker>, 'onChange' | 'value'> & {
  fieldName: string
  control: any
}

export const ControlledColorPicker = ({ fieldName, control, ...inputProps }: ControlledInputProps) => {
  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field, fieldState }) => <ColorPicker error={fieldState?.error} {...inputProps} {...field} />}
    />
  )
}