import { useContext, useEffect, useState } from 'react';
import { BiTrashAlt } from 'react-icons/bi';
import { KeyPatientsContext } from '../../pages/patients-add';
import { DateTime } from 'luxon';
import { PatientsJoined } from '../../prisma/controllers/patientsController';
import ReactPaginate from 'react-paginate';

interface ITableProps {
  headers: string[];
  data: PatientsJoined[];
}

interface ITableHeaderProps {
  headers: string[];
}

export default function Table({ headers, data }: ITableProps) {
  const itemsPerPage = 15;
  const [currentItems, setCurrentItems] = useState([] as PatientsJoined[]);
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
        containerClassName="pagination flex flex-row gap-2 text-lg max-w-32 w-32 select-none"
        activeClassName="font-bold"
        nextLinkClassName="pl-5"
        previousLinkClassName="pr-5"
      />
      <table className="min-w-full table-auto border border-slate-400">
        <TableHeader headers={headers}></TableHeader>
        <tbody className="bg-gray-200">
          {currentItems.map((object: PatientsJoined, index: number) => (
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
      <tr className="bg-gray-800">
        {headers.map((header: string, index: number) => (
          <th className="px-2 py-2" key={index}>
            <span className="text-gray-200">{header}</span>
          </th>
        ))}
        <th className="px-2 py-2">
          <span className="text-gray-200">Действия</span>
        </th>
      </tr>
    </thead>
  );
}

function TableRow(data: PatientsJoined) {
  const { setDeleteKey } = useContext(KeyPatientsContext);

  const onDelete = () => {
    setDeleteKey && setDeleteKey(data.id);
  };

  // ['Логин', 'Пароль', 'Имя пользователя', 'Права']

  return (
    <tr className="bg-gray-50 text-center">
      <td className="px-2 py-2">
        <span>{data.email}</span>
      </td>
      <td className="px-2 py-2">
        <span>{data.name}</span>
      </td>
      <td className="px-2 py-2">
        <span>{data.surname}</span>
      </td>
      <td className="px-2 py-2">
        <span>{data.patronymic}</span>
      </td>
      <td className="px-2 py-2">
        <span>
          {DateTime.fromISO(data.birthday.toString()).toFormat('yyyy-MM-dd')}
        </span>
      </td>
      <td className="px-2 py-2">
        <span>{data.gender}</span>
      </td>
      <td className="px-2 py-2">
        <span>{data.phone_number}</span>
      </td>

      <td className="px-2 py-2 flex justify-around gap-1">
        <button className="cursor" onClick={onDelete}>
          <BiTrashAlt size={25} color={'rgb(244, 63, 94)'}></BiTrashAlt>
        </button>
      </td>
    </tr>
  );
}
