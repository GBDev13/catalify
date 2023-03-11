import { ComponentProps } from 'react'
import { Controller } from 'react-hook-form'
import { FileUpload } from '.'

type ControlledInputProps = Omit<ComponentProps<typeof FileUpload>, 'onDrop' | 'onRemove'> & {
  fieldName: string
  control: any
  onRemove?: (removed: File) => void
  onDrop?: (files: File[]) => void
}

export const ControlledFileUpload = ({ fieldName, control, onRemove, onDrop: customOnDrop, ...inputProps }: ControlledInputProps) => {
  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field, fieldState }) => {
        const handleRemoveFile = (index: number) => {
          if(onRemove) onRemove(field.value[index])
          // @ts-ignore
          field.onChange(field?.value?.filter((_, i) => i !== index) ?? [])
        }

        const onDrop = inputProps.isMultiple ? (files: File[]) => field.onChange([...(field?.value ?? []), ...files]) : (files: File[]) => field.onChange(files)

        return (
          <FileUpload
            {...inputProps}
            onDrop={customOnDrop ? customOnDrop : onDrop}
            submittedFiles={field.value}
            error={fieldState.error?.message}
            onRemove={handleRemoveFile}
          />
        )
      }}
    />
  )
}

