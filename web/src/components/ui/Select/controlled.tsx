import { ComponentProps } from 'react'
import { Controller } from 'react-hook-form'
import { Select } from '.'

type ControlledInputProps = ComponentProps<typeof Select> & {
  fieldName: string
  control: any
}

export const ControlledSelect = ({ fieldName, control, ...inputProps }: ControlledInputProps) => {
  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field, fieldState }) => <Select error={fieldState?.error} {...inputProps} {...field} />}
    />
  )
}