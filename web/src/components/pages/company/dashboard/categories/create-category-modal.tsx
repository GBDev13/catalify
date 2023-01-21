import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form"
import toast from "react-hot-toast";
import { Button } from "src/components/ui/Button";
import { Dialog } from "src/components/ui/Dialog";
import { ControlledInput } from "src/components/ui/Input/controlled";
import { productsKey } from "src/constants/query-keys";
import { createCategory, updateCategory } from "src/services/products";
import { useCompany } from "src/store/company";
import { z } from "zod";

const createCategoryFormSchema = z.object({
  name: z.string({
    required_error: 'O nome da categoria é obrigatório'
  }).min(3, {
    message: 'O nome da categoria deve ter no mínimo 3 caracteres'
  }).max(30, {
    message: 'O nome da categoria deve ter no máximo 30 caracteres'
  })
})

type CreateCategoryFormData = z.infer<typeof createCategoryFormSchema>

type CreateCategoryFormProps = {
  initialData?: Products.Category
  onSuccess: () => void
}

type CreateCategoryModalProps = {
  children: ReactNode
  initialData?: Products.Category
}

const CreateCategoryForm = ({ onSuccess, initialData }: CreateCategoryFormProps) => {
  const { control, handleSubmit, formState: { isSubmitting } } = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategoryFormSchema),
    defaultValues: initialData ?{
      name: initialData.name
    } : undefined
  });


  const companyId = useCompany(x => x.company?.id)

  const queryClient = useQueryClient()

  const { mutateAsync: handleCreateCategory } = useMutation((category: string) => toast.promise(createCategory(category, companyId!), {
    loading: 'Criando categoria...',
    success: 'Categoria criada com sucesso!',
    error: (err) => err?.response?.data?.message ?? 'Erro ao criar categoria'
  }), {
    onSuccess: () => {
      queryClient.invalidateQueries(productsKey.categories)
      onSuccess()
    }
  })

  const { mutateAsync: handleUpdateCategory } = useMutation((category: string) => toast.promise(updateCategory({ id: initialData?.id!, name: category }, companyId!), {
    loading: 'Atualizando categoria...',
    success: 'Categoria atualizada com sucesso!',
    error: (err) => err?.response?.data?.message ?? 'Erro ao atualizar categoria'
  }), {
    onSuccess: () => {
      queryClient.invalidateQueries(productsKey.categories)
      onSuccess()
    }
  })

  const onSubmit = async (data: CreateCategoryFormData) => {
    try {
      if(initialData) {
        await handleUpdateCategory(data.name)
      } else {
        await handleCreateCategory(data.name)
      }
    } catch {}
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <ControlledInput control={control} fieldName="name" placeholder="Roupas" label="Nome da categoria" />
      <Button type="submit" size="WIDE" isLoading={isSubmitting}>{initialData ? 'Atualizar Categoria' : 'Adicionar Categoria'}</Button>
    </form>
  )
}

export const CreateCategoryModal = ({ children, initialData }: CreateCategoryModalProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog title={initialData ? "Atualizar Categoria" : "Adicionar Categoria"} maxWidth="600px" content={<CreateCategoryForm initialData={initialData} onSuccess={() => setOpen(false)} />} open={open} onOpenChange={setOpen}>
      {children}
    </Dialog>
  )
}