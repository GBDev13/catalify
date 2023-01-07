import { ComponentProps } from 'react'
import { Controller } from 'react-hook-form'
import { Checkbox } from '.'

type ControlledInputProps = ComponentProps<typeof Checkbox> & {
  fieldName: string
  control: any
}

export const ControlledCheckbox = ({ fieldName, control, ...inputProps }: ControlledInputProps) => {
  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field, fieldState }) => <Checkbox error={fieldState?.error} {...inputProps} {...field} checked={field.value} onCheckedChange={(value) => field.onChange(value === true)} />}
    />
  )
}