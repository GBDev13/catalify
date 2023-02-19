import { ReactNode, useCallback, useEffect, useState } from "react"
import { Button } from "src/components/ui/Button"
import { Dialog } from "src/components/ui/Dialog"
import { FileUpload } from "src/components/ui/FileUpload"
import { SHEETS_MAX_SIZE, SHEETS_TYPES } from "src/constants/constants"
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { toast } from "react-hot-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ImportProduct, importProducts } from "src/services/products"
import { useCompany } from "src/store/company"
import { productsKey } from "src/constants/query-keys"

type ImportProductsModalProps = {
  children: ReactNode
}

const SHEET_COLUMNS = [
  {
    name: 'Nome',
    key: 'name',
    required: true,
  },
  {
    name: 'Descrição',
    key: 'description',
    required: true, 
  },
  {
    name: 'Preço',
    key: 'price',
    required: true,
  },
  {
    name: 'Preço Promocional',
    key: 'promoPrice',
    required: false,
  },
  {
    name: 'Categoria',
    key: 'category',
    required: false,
  },
  {
    name: 'Visível no catálogo',
    key: 'visible',
    required: false,
    defaultValue: "S"
  },
  {
    name: 'Destaque',
    key: 'highlight',
    required: false,
    defaultValue: "N"
  }
]

type SheetError = {
  row: number
  column: string
}

type SheetData = {
  name: string
  description: string
  price: number
  promoPrice?: number
  category?: string
  visible: string
  highlight: string
}

type ImportProductsModalContentProps = {
  onSuccess: () => void
}

const ImportProductsModalContent = ({ onSuccess }: ImportProductsModalContentProps) => {
  const { company } = useCompany()
  const companyId = company?.id!

  const [files, setFiles] = useState<File[]>([])
  const [sheetData, setSheetData] = useState<SheetData[]>([])
  const [sheetErrors, setSheetErrors] = useState<SheetError[]>([])

  const buttonIsDisabled = sheetData.length <= 0 || sheetErrors.length > 0

  useEffect(() => {
    if(sheetErrors.length <= 0) return

    const aggregatedErrors = sheetErrors.reduce((acc, error) => {
      if(!acc[error.row]) {
        acc[error.row] = []
      }
      acc[error.row].push(error.column)
      return acc
    }, {} as Record<number, string[]>)
    toast.error(`Alguns campos obrigatórios não foram preenchidos. Verifique as seguintes linhas e campos:\n${Object.keys(aggregatedErrors).map((row) => `Linha ${row}: ${aggregatedErrors[row as any].join(', ')}`).join('\n')} `, {
      duration: 10000,
    })
  }, [sheetErrors])

  const onDrop = useCallback((acceptedFiles: File[]) => {

    setSheetErrors([])
    setSheetData([])
    setFiles([])

    if(acceptedFiles.length <= 0) return

    const reader = new FileReader();

    reader.onload = () => {
      const binaryStr = reader.result;
      const fileType = acceptedFiles[0].type;

      if (
        fileType === 'application/vnd.ms-excel' ||
        fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][];

        const errors: SheetError[] = []

        const parsedData = data.filter((x) => x.length > 0).map((row: any, rowIndex) => {
          const parsedRow = SHEET_COLUMNS.reduce((acc, column, index) => {
            const value = row[index];
            if(!value && column.required) {
              errors.push({
                row: rowIndex + 1,
                column: column.name,
              })
            }
            acc[column.key] = value ?? column.defaultValue
            return acc
          }, {} as Record<string, unknown>)
          return parsedRow
        })

        if(errors.length) {
          setSheetErrors(errors)
          return
        }
        
        setSheetData(parsedData.filter((row: any) => row.name).slice(1) as SheetData[]);
      } else if (fileType === 'text/csv') {
        Papa.parse(binaryStr as string, {
          header: true,
          complete: (results) => {
            const orderedFields = results.meta.fields;
            const fieldsArray: unknown[][] = []

            results.data.forEach((row: any) => {
              const rowArray: unknown[] = []
              orderedFields?.forEach((field: string) => {
                rowArray.push(!!row[field] ? row[field] : undefined)
              })
              fieldsArray.push(rowArray)
            })

            const errors: SheetError[] = []

            const parsedData = fieldsArray.filter(x => x.some(item => item !== undefined)).map((row: any, rowIndex) => {
              const parsedRow = SHEET_COLUMNS.reduce((acc, column, index) => {
                const value = row[index];
                if(!value && column.required) {
                  errors.push({
                    row: rowIndex + 2,
                    column: column.name,
                  })
                }
                acc[column.key] = value ?? column.defaultValue
                return acc
              }, {} as Record<string, unknown>)
              return parsedRow
            })

            if(errors.length) {
              setSheetErrors(errors)
              return
            }
            
            setSheetData(parsedData.filter((row: any) => row.name) as SheetData[]);
          },
        });
      }
    };

    reader.readAsBinaryString(acceptedFiles[0]);
    setFiles(acceptedFiles);
  }, [])

  const handleDownloadTemplate = () => {
    window.open("/sheets/importacao-de-produtos.xlsx")
  }

  const queryClient = useQueryClient()

  const { mutateAsync: handleImportProducts, isLoading } = useMutation((dto: ImportProduct[]) => toast.promise(importProducts(companyId, dto), {
    loading: 'Importando produtos...',
    success: 'Produtos importados com sucesso!',
    error: 'Erro ao importar produtos',
  }), {
    onSuccess: () => {
      queryClient.invalidateQueries(productsKey.all)
      setSheetData([])
      setSheetErrors([])
      onSuccess()
    }
  })

  const handleImport = async () => {
    if(buttonIsDisabled) return

    try {
      const importDto: ImportProduct[] = sheetData?.map((row) => ({
        price: Number(row.price),
        promoPrice: row?.promoPrice ? Number(row.promoPrice): undefined,
        visible: row?.visible === 'S',
        highlight: row?.highlight === 'S',
        categoryName: row?.category,
        description: row?.description,
        name: row.name,
      }))

      await handleImportProducts(importDto)
    } catch {}
  }

  return (
    <div className="flex flex-col">
      <p className="text-slate-500 font-light mb-4">Faça o upload de uma planilha contendo informações básicas dos seus produtos e iremos cadastra-los de forma simples e prática!</p>

      <FileUpload
        acceptedTypes={SHEETS_TYPES}
        maxSize={SHEETS_MAX_SIZE}
        maxFiles={1}
        customAcceptTypesLabel="CSV, XLS, XLSX"
        withPreview={true}
        previewMode="INSIDE"
        submittedFiles={files}
        onDrop={onDrop}
        onRemove={() => setFiles([])}
      />

      <div className="ml-auto mt-4 flex items-center gap-2">
        <Button variant="OUTLINE" onClick={handleDownloadTemplate}>
          Baixar planilha modelo
        </Button>
        <Button disabled={buttonIsDisabled || isLoading} onClick={handleImport}>
          {(sheetData && sheetData?.length > 0) ? `Importar ${sheetData.length} produtos` : 'Importar'}
        </Button>
      </div>
    </div>
  )
}

export const ImportProductsModal = ({ children }: ImportProductsModalProps) => {
  const [open, setOpen] = useState(false)
  return (
    <Dialog title="Importar Produtos" content={<ImportProductsModalContent onSuccess={() => setOpen(false)} />} maxWidth="800px" open={open} onOpenChange={setOpen}>
      {children}
    </Dialog>
  )
}