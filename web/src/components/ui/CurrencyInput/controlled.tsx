import { ComponentProps } from 'react'
import { Controller } from 'react-hook-form'
import { CurrencyInput } from '.'

type ControlledCurrencyInputProps = Omit<ComponentProps<typeof CurrencyInput>, 'onValueChange' | 'value'> & {
  fieldName: string
  control: any
}

export const ControlledCurrencyInput = ({ fieldName, control, ...inputProps }: ControlledCurrencyInputProps) => {
  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field, fieldState }) => <CurrencyInput error={fieldState?.error} {...inputProps} {...field} onValueChange={field.onChange} />}
    />
  )
}