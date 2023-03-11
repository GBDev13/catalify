import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { DashboardSEO } from "src/components/pages/shared/DashboardSEO";
import { PageTitle } from "src/components/pages/shared/PageTitle";
import { Table } from "src/components/ui/Table";
import { adminKeys } from "src/constants/query-keys";
import { checkAdminSSR } from "src/helpers/check-admin-ssr";
import { isSubscriptionValid } from "src/helpers/isSubscriptionValid";
import { withAuth } from "src/helpers/withAuth";
import { getCompanies, getFiles } from "src/services/admin";

export default function SuperFiles() {
  const { data: session } = useSession();

  const { data: files } = useQuery(adminKeys.getCompanies, getFiles, {
    enabled: !!session
  })

  const cols = useMemo<ColumnDef<Admin.File>[]>(
    () => [
      {
        header: 'Nome do Arquivo',
        cell: (row) => (
          <a className="hover:text-indigo-500 hover:underline transition-all" href={row?.row?.original?.fileUrl} target="_blank" rel="noreferrer">
            {row?.row?.original?.fileName}
          </a>
        ),
        accessorKey: 'fileName',
      },
      {
        header: 'É Produto?',
        cell: (row) => (
          <span>
            {row.getValue() ? 'Sim' : 'Não'}
          </span>
        ),
        accessorKey: 'productId',
      },
      {
        header: 'Criado em',
        cell: (row) => (
          <span className="block w-full">
            {new Date(row?.row?.original?.createdAt!).toLocaleDateString('pt-BR')}
          </span>
        ),
        accessorKey: 'createdAt',
        sortingFn: (a, b) => new Date(a.original.createdAt!).getTime() - new Date(b.original.createdAt!).getTime(),
      }
    ],
    []
  );
  
  return (
    <>
      <DashboardSEO title="Arquivos" />
      <PageTitle title="Arquivos" />

      <Table emptyState={{
        title: 'Sem arquivos',
        description: '',
      }} columns={cols} data={files ?? []} initialState={{
        sorting: [
          { id: 'createdAt', desc: true }
        ]
      }} />
    </>
  )
}

export const getServerSideProps = withAuth(async (context) => {
  return checkAdminSSR(context)
});