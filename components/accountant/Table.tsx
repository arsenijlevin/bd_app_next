import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { doctorToString, patientToString } from '../../lib/doctors/helpers';
import { renderedServicesJoined } from '../../prisma/controllers/accountantController';

interface ITableProps {
  headers: string[];
  data: renderedServicesJoined[];
}

interface ITableHeaderProps {
  headers: string[];
}

export default function Table({ headers, data }: ITableProps) {
  const itemsPerPage = 5;
  const [currentItems, setCurrentItems] = useState(
    [] as renderedServicesJoined[]
  );
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;

    setCurrentItems(data.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(data.length / itemsPerPage));
  }, [data, itemOffset, itemsPerPage]);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % data.length;

    setItemOffset(newOffset);
  };

  return (
    <>
      <ReactPaginate
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        pageCount={pageCount}
        previousLabel="<"
        breakLabel="..."
        containerClassName="pagination flex flex-row gap-2 text-lg max-w-32 w-32"
        activeClassName="font-bold"
        nextLinkClassName="pl-5"
        previousLinkClassName="pr-5"
      />
      <table className="min-w-full table-auto border border-slate-400">
        <TableHeader headers={headers}></TableHeader>
        <tbody className="bg-gray-200">
          {currentItems.map((object: renderedServicesJoined, index: number) => (
            <TableRow key={index} {...object} />
          ))}
        </tbody>
      </table>
    </>
  );
}

function TableHeader({ headers }: ITableHeaderProps) {
  return (
    <thead>
      <tr className="bg-gray-800 border-slate-600">
        {headers.map((header: string, index: number) => (
          <th className="px-2 py-2 border border-slate-600" key={index}>
            <span className="text-gray-200">{header}</span>
          </th>
        ))}
      </tr>
    </thead>
  );
}

function TableRow(service: renderedServicesJoined) {
  return (
    <tr className="bg-gray-50 text-center border border-slate-400">
      <td className="border-slate-400 border">
        {service.date_time.toLocaleString()}
      </td>
      <td className="border-slate-400 border px-4">{service.services.title}</td>
      <td className="border-slate-400 border px-4">
        {doctorToString(service.doctors)}
      </td>
      <td className="border-slate-400 border px-4">
        {patientToString(service.patients)}
      </td>
      <td className="border-slate-400 border px-4">
        {parseFloat(service.services.price.toString()).toFixed(2)} руб.
      </td>
      <td className="border-slate-400 border px-4">{service.result}</td>
    </tr>
  );
}
