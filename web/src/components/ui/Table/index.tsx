import { getCoreRowModel, useReactTable, flexRender, getPaginationRowModel } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { PaginationButton } from './pagination-button';

interface ReactTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  showFooter?: boolean;
  showNavigation?: boolean;
  emptyState?: {
    title: string;
    description: string;
  }
}

export const Table = <T extends object>({ data, columns, emptyState, showFooter = false, showNavigation = true, }: ReactTableProps<T>) => {
 const table = useReactTable({
   data,
   columns,
   getCoreRowModel: getCoreRowModel(),
   getPaginationRowModel: getPaginationRowModel(),
 });

 return (
   <div className="flex flex-col w-full">
     <div className="overflow-x-auto">
       <div className="inline-block min-w-full">
         <div className="overflow-hidden bg-slate-50 rounded">

           <table className="min-w-full text-left">
             <thead className="border-b bg-slate-100">
               {table.getHeaderGroups().map((headerGroup) => (
                 <tr key={headerGroup.id}>
                   {headerGroup.headers.map((header) => (
                     <th key={header.id} className="px-6 py-4 text-sm font-medium text-gray-900" style={{ width: header.getSize() }}>
                       {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                     </th>
                   ))}
                 </tr>
               ))}
             </thead>
             <tbody>
               {table.getRowModel().rows.map((row) => (
                 <tr key={row.id} className='border-b" bg-slate-50'>
                   {row.getVisibleCells().map((cell) => (
                     <td className="whitespace-nowrap px-6 py-4 text-sm font-light text-gray-900" key={cell.id} style={{ width: cell.column.getSize() }}>
                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
                     </td>
                   ))}
                 </tr>
               ))}
             </tbody>
             {showFooter ? (
               <tfoot className="border-t bg-slate-50">
                 {table.getFooterGroups().map((footerGroup) => (
                   <tr key={footerGroup.id}>
                     {footerGroup.headers.map((header) => (
                       <th key={header.id} colSpan={header.colSpan}>
                         {header.isPlaceholder
                           ? null
                           : flexRender(header.column.columnDef.footer, header.getContext())}
                       </th>
                     ))}
                   </tr>
                 ))}
               </tfoot>
             ) : null}
           </table>

            {data.length <= 0 && emptyState && (
              <div className="w-full flex items-center justify-center flex-col py-14">
                <img className="w-[200px]" src="/images/empty-table.png" /> 
                <h3 className="text-indigo-500 font-semibold text-2xl mt-4 mb-2">{emptyState.title}</h3>
                <p className="text-sm text-slate-500">{emptyState.description}</p>
              </div>
            )}

           {showNavigation ? (
             <section className="p-4 flex items-center justify-end gap-8 border-t">
                <select
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-[150px] p-2.5"
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                  }}
                >
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Exibir {pageSize}
                    </option>
                  ))}
                </select>

                <span className="flex text-sm items-center gap-1 text-slate-600">
                  <div>Página</div>
                  <strong className="font-semibold">
                    {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                  </strong>
                </span>

               <div className="flex items-center gap-2">
                <PaginationButton
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    {'<<'}
                  </PaginationButton>
                  <PaginationButton
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    {'<'}
                  </PaginationButton>
                  <PaginationButton
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    {'>'}
                  </PaginationButton>
                  <PaginationButton
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    {'>>'}
                  </PaginationButton>
               </div>
             </section>
           ) : null}
         </div>
       </div>
     </div>
   </div>
 );
};