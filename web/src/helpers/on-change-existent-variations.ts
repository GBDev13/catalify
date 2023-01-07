import { Dispatch, SetStateAction } from "react"
import { variationsSchema } from "src/pages/company/dashboard/products/edit/[id]"
import { z } from "zod"

export type ChangeType = 'variation' | 'option'

export type ActionType = 'remove' | 'change'

export type SaveItem = {
  id: string,
  type: ChangeType,
  actionType: ActionType,
}

type OnChangeExistentVariationProps = {
  type: ChangeType;
  actionType: ActionType;
  fieldId: string;
  saveFunction: Dispatch<SetStateAction<SaveItem[]>>
  allVariations: Products.Variant[]
}

export const onChangeExistentVariation = ({ type, fieldId, actionType, saveFunction, allVariations }: OnChangeExistentVariationProps) => {
  saveFunction((prevState) => {
    const alreadyExists = prevState.find((item) => item.id === fieldId)

    if(actionType === 'change' && alreadyExists) {
      const filtered = prevState.filter((item) => item.id !== fieldId)
      return [...filtered, { actionType, id: fieldId, type }]
    }

    if(actionType === 'remove' && alreadyExists) {
      const filtered = prevState.filter((item) => item.id !== fieldId)
      return [...filtered, { actionType, id: fieldId, type }]
    }

    if(actionType === 'remove' && type === 'variation') {
      const currentVariation = allVariations.find((item) => item.id === fieldId)
      const hasChildOptionInList = prevState.find((item) => currentVariation?.options.some(x => x.id === item.id))

      if(hasChildOptionInList) {
        const filtered = prevState.filter((item) => !currentVariation?.options.some(x => x.id === item.id))
        return [...filtered, { actionType, id: fieldId, type }]
      }
    }

    return [...prevState, { actionType, id: fieldId, type }]
  })
}

export type ParseEditedResponse = {
  edited: {
    id: string;
    type: ChangeType;
    newValue: string;
  }[];
  removed: SaveItem[];
  added: {
    type: ChangeType;
    name?: string;
    options?: string[];
    variationId?: string;
    value?: string;
  }[];
}

export const parseEditedVariations = (editedVariations: SaveItem[], allVariations: z.infer<typeof variationsSchema>): ParseEditedResponse => {
  const edited = editedVariations.filter((item) => item.actionType === 'change').map((item) => {
    const found = item.type === 'variation' ? allVariations.find((variation) => variation.originalId === item.id) : allVariations.flatMap(x => x.options).find((option) => option.originalId === item.id)
    return {
      ...item,
      // @ts-ignore
      newValue: item.type === 'variation' ? found?.name : found?.value
    }
  });
  const removed = editedVariations.filter((item) => item.actionType === 'remove');

  const addedOptions = allVariations.filter(item => item.options.some(x => !x.originalId)).filter(x => x.originalId).map(item => {
    const options = item.options.filter(x => !x.originalId)
    return { options: options.map(x => x.value), variationId: item.originalId }
  }).flatMap(x => x.options.map(y => ({ variationId: x.variationId, value: y, type: 'option' as ChangeType })))

  const addedVariations = allVariations.filter(x => !x.originalId).map(x => ({ type: 'variation' as ChangeType, name: x.name, options: x.options.map(x => x.value) }))

  return { edited, removed, added: [...addedOptions, ...addedVariations] }
}