import clsx from "clsx";
import React from "react";
import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { FiPlus, FiX } from "react-icons/fi";
import { Input } from "src/components/ui/Input";
import { Tooltip } from "src/components/ui/Tooltip";
import { ActionType, ChangeType } from "src/helpers/on-change-existent-variations";
import { NewProductFormData } from "src/pages/app/dashboard/products/new";

type OptionItemProps = {
  nestIndex: number;
  control: Control<NewProductFormData>;
  register: any;
  onChangeExistent?: (type: ChangeType, actionType: ActionType, fieldId: string) => void;
  existentVariations?: Products.Variant[]
}

export const OptionItem = ({ nestIndex, control, register, onChangeExistent, existentVariations }: OptionItemProps) => {
  const { watch, formState: { errors } } = useFormContext<NewProductFormData>()
  
  const { fields, remove, append } = useFieldArray({
    control,
    name: `variations.${nestIndex}.options`
  });

  const handleAddVariationOption = () => {
    append({ value: "" })
  }

  const handleRemoveVariationOption = (index: number) => {
    const field = watch('variations')[nestIndex].options[index] as any;
    if(field?.originalId && onChangeExistent) {
      onChangeExistent('option', 'remove', field.originalId);
    }
    remove(index);
  }

  return (
    <div>
      <div className="flex flex-col gap-2 border-t pt-2 mt-2">
        {fields.map((item, k) => {
          const currPos = k + 1;
          const isLast = currPos === fields.length;
          return (
            <div key={item.id} className="flex gap-2">

              <Input
                className="flex-1"
                label={`Opção ${currPos}`}
                {...register(`variations.${nestIndex}.options.${k}.value` as const, {
                  onBlur: (value: any) => {
                    if(onChangeExistent) {
                      const field = watch('variations')[nestIndex].options[k] as any;
                      if(field.originalId) {
                        onChangeExistent('option', 'change', field.originalId);
                      }
                    }
                    return value
                  }
                })}
                defaultValue={item.value}
                error={errors.variations?.[nestIndex]?.options?.[k]?.value}
              />

              <div className={clsx("grid grid-cols-1 gap-2", { "grid-cols-2": isLast })}>
                <Tooltip content={`Remover Opção ${currPos}`}>
                  <button className="h-6 w-6 rounded-full mt-[26px] flex items-center justify-center border border-indigo-500 transition-colors  text-indigo-500 hover:bg-indigo-500 hover:text-white" type="button" onClick={() => handleRemoveVariationOption(k)}>
                    <FiX size={15} />
                  </button>
                </Tooltip>
                {isLast && (
                <Tooltip content={`Adicionar nova opção`}>
                  <button className="h-6 w-6 rounded-full mt-[26px] flex items-center justify-center border border-indigo-500 transition-colors  text-indigo-500 hover:bg-indigo-500 hover:text-white" type="button" onClick={handleAddVariationOption}>
                    <FiPlus size={15} />
                  </button>
                </Tooltip>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {errors.variations?.[nestIndex]?.options && (
        <p className="text-red-500 text-sm mt-2">{errors.variations?.[nestIndex]?.options?.message}</p>
      )}
    </div>
  );
}