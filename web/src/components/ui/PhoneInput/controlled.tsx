import { ComponentProps } from 'react'
import { Controller } from 'react-hook-form'
import { PhoneInput } from '.'

type ControlledInputProps = ComponentProps<typeof PhoneInput> & {
  fieldName: string
  control: any
}

export const ControlledPhoneInput = ({ fieldName, control, ...inputProps }: ControlledInputProps) => {
  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field, fieldState }) => <PhoneInput error={fieldState?.error} {...inputProps} {...field} />}
    />
  )
}