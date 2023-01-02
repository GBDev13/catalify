import { ComponentProps } from 'react'
import { Controller } from 'react-hook-form'
import { Editor } from '.'

type ControlledEditorProps = Omit<ComponentProps<typeof Editor>, 'content' | 'onContentUpdated'> & {
  fieldName: string
  control: any
}

export const ControlledEditor = ({ fieldName, control, ...inputProps }: ControlledEditorProps) => {
  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field, fieldState }) => <Editor error={fieldState?.error} {...inputProps} onContentUpdated={field.onChange} content={field.value} />}
    />
  )
}