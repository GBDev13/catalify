import { ComponentProps } from 'react'
import { Controller } from 'react-hook-form'
import { ToggleGroup } from '.'

type ControlledInputProps = ComponentProps<typeof ToggleGroup> & {
  fieldName: string
  control: any
}

export const ControlledToggleGroup = ({ fieldName, control, ...inputProps }: ControlledInputProps) => {
  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field, fieldState }) => <ToggleGroup error={fieldState?.error} {...inputProps} {...field} onValueChange={(value: any) => {
        if(value) field.onChange(value)
      }} />}
    />
  )
}