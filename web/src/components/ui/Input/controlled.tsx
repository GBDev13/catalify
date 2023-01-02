import { ComponentProps } from 'react'
import { Controller } from 'react-hook-form'
import { Input } from '.'

type ControlledInputProps = ComponentProps<typeof Input> & {
  fieldName: string
  control: any
}

export const ControlledInput = ({ fieldName, control, ...inputProps }: ControlledInputProps) => {
  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field, fieldState }) => <Input error={fieldState?.error} {...inputProps} {...field} />}
    />
  )
}