import { ComponentProps } from 'react'
import { Controller } from 'react-hook-form'
import { FileUpload } from '.'

type ControlledInputProps = Omit<ComponentProps<typeof FileUpload>, 'onDrop'> & {
  fieldName: string
  control: any
}

export const ControlledFileUpload = ({ fieldName, control, ...inputProps }: ControlledInputProps) => {
  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field, fieldState }) => {
        const handleRemoveFile = (index: number) => {
          // @ts-ignore
          field.onChange(field?.value?.filter((_, i) => i !== index) ?? [])
        }

        const onDrop = inputProps.isMultiple ? (files: File[]) => field.onChange([...(field?.value ?? []), ...files]) : (files: File[]) => field.onChange(files)

        return (
          <FileUpload
            {...inputProps}
            onDrop={onDrop}
            submittedFiles={field.value}
            error={fieldState.error?.message}
            onRemove={handleRemoveFile}
          />
        )
      }}
    />
  )
}

