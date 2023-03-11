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
import { getCompanies } from "src/services/admin";

export default function SuperCompanies() {
  const { data: session } = useSession();

  const { data: companies } = useQuery(adminKeys.getCompanies, getCompanies, {
    enabled: !!session
  })

  const cols = useMemo<ColumnDef<Admin.Company>[]>(
    () => [
      {
        header: 'Empresa',
        cell: (row) => {
          const company = row?.row?.original;
          return (
            <a className="hover:text-indigo-500 hover:underline transition-all" href={`https://${company.slug}.catalify.com.br`} target="_blank" rel="noreferrer">
              {`${company.name} (${company.slug})`}
            </a>
          )
        },
        accessorKey: 'name',
      },
      {
        header: 'Usuário',
        cell: (row) => {
          const owner = row?.row?.original?.owner;
          return [owner?.firstName, owner?.lastName].filter(Boolean).join(' ')
        },
        accessorKey: 'owner',
      },
      {
        header: 'Produtos',
        cell: (row) => row?.row?.original?.quantities?.products,
      },
      {
        header: 'Categorias',
        cell: (row) => row?.row?.original?.quantities?.categories,
      },
      {
        header: 'Pedidos',
        cell: (row) => row?.row?.original?.quantities?.orders,
      },
      {
        header: 'Plano',
        cell: (row) => {
          const subscription = row?.row?.original?.subscription?.[0];
          const isPremium = isSubscriptionValid(subscription);
          return isPremium ? 'Premium' : 'Gratuito';
        }
      },
      {
        header: 'Criada em',
        cell: (row) => (
          <span className="block w-full">
            {new Date(row?.row?.original?.createdAt!).toLocaleDateString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
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
      <DashboardSEO title="Empresas" />
      <PageTitle title="Empresas" />

      <Table emptyState={{
        title: 'Sem empresas',
        description: '',
      }} columns={cols} data={companies ?? []} initialState={{
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