import { ReactNode } from "react";

type InfoItemProps = {
  title: string;
  icon: ReactNode;
  value?: number;
}

export const InfoItem = ({ title, icon, value }: InfoItemProps) => {
  const formattedValue = (value ?? 0).toLocaleString('pt-BR');

  return (
    <div className="bg-slate-100 shadow-sm rounded-md p-4 min-h-[140px] flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">{title}</h3>

        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
          {icon}
        </div>
      </div>

      <p className="text-slate-500 font-semibold text-4xl">{formattedValue}</p>
    </div>
  )
}