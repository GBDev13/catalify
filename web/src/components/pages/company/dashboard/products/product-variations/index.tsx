import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FiX } from "react-icons/fi";
import { Button } from "src/components/ui/Button";
import { Input } from "src/components/ui/Input";
import { Tooltip } from "src/components/ui/Tooltip";
import { ActionType, ChangeType } from "src/helpers/on-change-existent-variations";
import { NewProductFormData } from "src/pages/company/dashboard/products/new";
import { VariantModel, VariantModelSelectorPopover } from "../variant-select-popover";
import { OptionItem } from "./option-item";

type ProductVariationsProps = {
  onChangeExistent?: (type: ChangeType, actionType: ActionType, fieldId: string) => void;
}

export default function ProductVariations({ onChangeExistent }: ProductVariationsProps) {
  const { control, register, watch, formState: { errors } } = useFormContext<NewProductFormData>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variations"
  });

  const handleAddVariation = () => {
    append({ name: "", options: [{ value: ""}] });
  }

  const handleAddModelVariation = (model: VariantModel) => {
    append({ name: model.name, options: model.options.map(option => ({ value: option })) });
  }

  const handleRemoveVariation = (index: number) => {
    const field = watch('variations')[index] as any;
    if(field.originalId && onChangeExistent) {
      onChangeExistent('variation', 'remove', field.originalId);
    }
    remove(index);
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-b-slate-300 pb-4 mt-6">
        <h4 className="text-2xl font-semibold text-slate-500">Variações do Produto</h4>
      </div>

      <div className="grid mt-2 grid-cols-1 gap-2 sm:gap-4 sm:grid-cols-2">
        <VariantModelSelectorPopover onSelectModel={handleAddModelVariation}>
          <Button className="min-h-0 py-2 text-sm" size="WIDE">Adicionar modelo</Button>
        </VariantModelSelectorPopover>
        <Button type="button" onClick={handleAddVariation} className="min-h-0 py-2 text-sm" size="WIDE">Adicionar nova variação</Button>
      </div>

      <section className="flex flex-col gap-8">
        {fields.map((item, index) => {
          return (
            <div className="flex flex-col gap-2 " key={item.id}>
              <div className="flex gap-2">
                <Input
                  className="flex-1"
                  label={`Nome da variação ${index + 1}`}
                  placeholder="Ex: Tamanho, Cor, Sabor, etc."
                  {...register(`variations.${index}.name` as const, {
                    onBlur: (value) => {
                      if(onChangeExistent) {
                        const field = watch('variations')[index] as any;
                        if(field.originalId) {
                          onChangeExistent('variation', 'change', field.originalId);
                        }
                      }
                      return value
                    }
                  })}
                  defaultValue={item.name}
                  error={errors.variations?.[index]?.name}
                />

                <Tooltip content="Remover variação">
                  <button className="h-6 w-6 rounded-full mt-[26px] flex items-center justify-center border border-indigo-500 transition-colors  text-indigo-500 hover:bg-indigo-500 hover:text-white" type="button" onClick={() => handleRemoveVariation(index)}>
                    <FiX size={15} />
                  </button>
                </Tooltip>
              </div>

              <OptionItem onChangeExistent={onChangeExistent} nestIndex={index} {...{ control, register }} />
            </div>
          );
        })}
      </section>
    </>
  );
}