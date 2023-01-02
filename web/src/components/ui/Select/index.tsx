
import { ComponentProps } from 'react'
import { ErrorOption } from 'react-hook-form'
import BaseSelect, { components, InputProps } from 'react-select'

type SelectProps = ComponentProps<typeof BaseSelect> & {
  label?: string
  error?: ErrorOption
}

const Input = (props: InputProps) => (
  <components.Input 
     {...props} 
     inputClassName="outline-none border-none shadow-none focus:ring-transparent"
  />
)


export const Select = ({ label, placeholder = "Selecione", error, ...props }: SelectProps) => {
  const hasError = !!error;

  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-slate-500 mb-1">
          {label}
        </label>
      )}

      <BaseSelect {...props} noOptionsMessage={() => <span className="text-sm text-slate-400">Não há opções</span>} classNamePrefix="react-select" className={hasError ? 'hasError' : ''} placeholder={placeholder} components={{ Input }}/>

      {hasError && (
        <span className="text-red-400 text-xs mt-2">{error.message}</span>
      )}
    </div>
  )
}