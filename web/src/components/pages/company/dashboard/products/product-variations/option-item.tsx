import React from "react";
import { Control, useFieldArray, useFormState } from "react-hook-form";
import { FiPlus, FiX } from "react-icons/fi";
import { Input } from "src/components/ui/Input";
import { Tooltip } from "src/components/ui/Tooltip";
import { NewProductFormData } from "src/pages/company/dashboard/products/new";

type OptionItemProps = {
  nestIndex: number;
  control: Control<NewProductFormData>;
  register: any;
}

export const OptionItem = ({ nestIndex, control, register }: OptionItemProps) => {
  const { errors } = useFormState<NewProductFormData>()
  
  const { fields, remove, append } = useFieldArray({
    control,
    name: `variations.${nestIndex}.options`
  });

  const handleAddVariationOption = () => {
    append({ value: "" })
  }

  return (
    <div>
      <div className="flex flex-col gap-2 border-t pt-2 mt-2">
        {fields.map((item, k) => {
          const currPos = k + 1;
          return (
            <div key={item.id} className="flex gap-2">

              <Input
                className="flex-1"
                label={`Opção ${currPos}`}
                {...register(`variations.${nestIndex}.options.${k}.value` as const)}
                defaultValue={item.value}
                error={errors.variations?.[nestIndex]?.options?.[k]?.value}
              />

              <div className="grid grid-cols-2 gap-2">
                <Tooltip content={`Remover Opção ${currPos}`}>
                  <button className="h-6 w-6 rounded-full mt-[26px] flex items-center justify-center border border-indigo-500 transition-colors  text-indigo-500 hover:bg-indigo-500 hover:text-white" type="button" onClick={() => remove(k)}>
                    <FiX size={15} />
                  </button>
                </Tooltip>
                <Tooltip content={`Adicionar nova opção`}>
                  <button className="h-6 w-6 rounded-full mt-[26px] flex items-center justify-center border border-indigo-500 transition-colors  text-indigo-500 hover:bg-indigo-500 hover:text-white" type="button" onClick={handleAddVariationOption}>
                    <FiPlus size={15} />
                  </button>
                </Tooltip>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}