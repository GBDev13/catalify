import { FiShoppingCart } from "react-icons/fi";
import { TfiReceipt } from "react-icons/tfi";
import { BiCategoryAlt } from 'react-icons/bi';
import { InfoItem } from "src/components/pages/company/dashboard/overview/InfoItem";
import { DashboardSEO } from "src/components/pages/shared/DashboardSEO";
import { PageTitle } from "src/components/pages/shared/PageTitle";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { companyKeys } from "src/constants/query-keys";
import { getCompanyOverview } from "src/services/company";
import { useCompany } from "src/store/company";

const CustomTooltip = (props: any) => {
  const { active, payload, label } = props;
  if (active) {
    const value = payload[0].value
    return (
      <div className="bg-white rounded-md p-4 shadow-lg border border-indigo-300">
        <p className="text-slate-500 font-semibold text-lg">{label}</p>
        <p className="text-slate-600 font-semibold text-xl">{`${value} ${value === 1 ? 'pedido' : 'pedidos'}`}</p>
      </div>
    );
  }

  return null;
}

export default function CompanyDashboard() {
  const { company } = useCompany()
  const companyId = company?.id!;

  const { data: companyOverview } = useQuery(companyKeys.companyOverview(companyId), () => getCompanyOverview(companyId), {
    enabled: !!companyId
  })

  const graphData = companyOverview?.weekOrders ?? [];

  return (
    <>
      <DashboardSEO title="Resumo" />
      <PageTitle title="Resumo" />

      <section className="w-full grid gap-2 grid-cols-1 lg:grid-cols-3 lg:gap-8">
        <InfoItem title="Produtos" icon={<FiShoppingCart size={20} />} value={companyOverview?.products} />
        <InfoItem title="Categorias" icon={<BiCategoryAlt size={20} />} value={companyOverview?.categories} />
        <InfoItem title="Pedidos do Mês" icon={<TfiReceipt size={20} />} value={companyOverview?.monthOrders} />
      </section>

      <section className="w-full mt-8 flex flex-col gap-4 bg-slate-100 px-2 md:px-3 py-4 rounded-md shadow-sm">
        <h3 className="text-2xl font-semibold">Pedidos da Semana</h3>
        {graphData.length > 0 && (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                width={500}
                height={400}
                data={graphData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" fontSize="12px" />
                <YAxis fontSize="12px" allowDecimals={false} />
                <Tooltip wrapperStyle={{ outline: 'none' }} content={<CustomTooltip />} />
                <Area type="monotone" dataKey="orders" fillOpacity={0.8} stroke="#818cf8" fill="#6366f1" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

      </section>
    </>
  )
}