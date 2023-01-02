import { Table } from "src/components/ui/Table"
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from "react";
type Product = {
  id: string
  name: string
  price: number
  category: {
    id: string
    name: string
  }
}

export default function CompanyProducts() {
  const data: Product[] = [
    {
      id: '1',
      name: 'Produto 1',
      price: 10,
      category: {
        id: '1',
        name: 'Categoria 1'
      }
    },
    {
      id: '1',
      name: 'Produto 1',
      price: 10,
      category: {
        id: '1',
        name: 'Categoria 1'
      }
    },
    {
      id: '1',
      name: 'Produto 1',
      price: 10,
      category: {
        id: '1',
        name: 'Categoria 1'
      }
    },
    {
      id: '1',
      name: 'Produto 1',
      price: 10,
      category: {
        id: '1',
        name: 'Categoria 1'
      }
    },
    {
      id: '1',
      name: 'Produto 1',
      price: 10,
      category: {
        id: '1',
        name: 'Categoria 1'
      }
    },
    {
      id: '1',
      name: 'Produto 1',
      price: 10,
      category: {
        id: '1',
        name: 'Categoria 1'
      }
    },
    {
      id: '1',
      name: 'Produto 1',
      price: 10,
      category: {
        id: '1',
        name: 'Categoria 1'
      }
    },
    {
      id: '1',
      name: 'Produto 1',
      price: 10,
      category: {
        id: '1',
        name: 'Categoria 1'
      }
    },
    {
      id: '1',
      name: 'Produto 1',
      price: 10,
      category: {
        id: '1',
        name: 'Categoria 1'
      }
    },
    {
      id: '1',
      name: 'Produto 1',
      price: 10,
      category: {
        id: '1',
        name: 'Categoria 1'
      }
    },
    {
      id: '1',
      name: 'Produto 1',
      price: 10,
      category: {
        id: '1',
        name: 'Categoria 1'
      }
    },
    {
      id: '1',
      name: 'Produto 1',
      price: 10,
      category: {
        id: '1',
        name: 'Categoria 1'
      }
    },
    {
      id: '1',
      name: 'Produto 1',
      price: 10,
      category: {
        id: '1',
        name: 'Categoria 1'
      }
    },
    {
      id: '1',
      name: 'Produto 1',
      price: 10,
      category: {
        id: '1',
        name: 'Categoria 1'
      }
    },
    {
      id: '1',
      name: 'Produto 1',
      price: 10,
      category: {
        id: '1',
        name: 'Categoria 1'
      }
    },
    {
      id: '1',
      name: 'Produto 1',
      price: 10,
      category: {
        id: '1',
        name: 'Categoria 1'
      }
    },
    {
      id: '1',
      name: 'Produto 1',
      price: 10,
      category: {
        id: '1',
        name: 'Categoria 1'
      }
    },
  ]

  const cols = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        header: 'Nome',
        cell: (row) => row.renderValue(),
        accessorKey: 'name',
        footer: 'Nome'
      },
      {
        header: 'Preço',
        cell: (row) => row.renderValue(),
        accessorKey: 'price',
        footer: 'Preço'
      },
      {
        header: 'Categoria',
        cell: (row) => row.renderValue(),
        accessorKey: 'category.name',
        footer: 'Categoria'
      },
    ],
    []
   );

  return (
    <>
      <header>
        <h1 className="text-4xl font-semibold mb-6">Produtos</h1>
      </header>

      <Table columns={cols} data={data} />
    </>
  )
}