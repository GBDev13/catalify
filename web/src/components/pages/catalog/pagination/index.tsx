
import ReactPaginate from 'react-paginate';

type PaginationProps = {
  currentPage: number
  setCurrentPage: (page: number) => void;
  pageCount: number;
}

export const Pagination = ({ currentPage, setCurrentPage, pageCount }: PaginationProps) => {
  const paginate = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  return (
    <ReactPaginate
      forcePage={currentPage}
      onPageChange={paginate}
      pageCount={pageCount}
      containerClassName="flex items-center gap-3 justify-center sm:justify-end"
      pageLinkClassName="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 transition-colors hover:bg-gray-200"
      activeLinkClassName="!bg-primary !text-white"
      disabledLinkClassName="opacity-50 cursor-not-allowed"
      nextLinkClassName="px-3 text-sm h-8 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 transition-colors hover:bg-gray-200"
      previousLinkClassName="px-3 text-sm h-8 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 transition-colors hover:bg-gray-200"
      previousLabel="Anterior"
      nextLabel="Próxima"
    />
  );
}