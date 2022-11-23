import { useContext } from 'react';
import { BiEdit, BiTrashAlt } from 'react-icons/bi';
import { KeyContext } from '../pages/database-viewer/users';

interface ITableProps<T> {
  headers: string[];
  data: T[];
}

interface ITableHeaderProps {
  headers: string[];
}

export default function Table<T extends Record<string, string | number>>({
  headers,
  data
}: ITableProps<T>) {
  return (
    <table className="min-w-full table-auto">
      <TableHeader headers={headers}></TableHeader>
      <tbody className="bg-gray-200">
        {data.map((object: T, index: number) => (
          <TableRow<T> key={index} {...object} />
        ))}
      </tbody>
    </table>
  );
}

function TableHeader({ headers }: ITableHeaderProps) {
  return (
    <thead>
      <tr className="bg-gray-800">
        {headers.map((header: string, index: number) => (
          <th className="px-16 py-2" key={index}>
            <span className="text-gray-200">{header}</span>
          </th>
        ))}
        <th className="px-16 py-2">
          <span className="text-gray-200">Действия</span>
        </th>
      </tr>
    </thead>
  );
}

function TableRow<T extends Record<string, string | number>>(data: T) {
  const { setSearchKey, setFormMode } = useContext(KeyContext);

  const onUpdate = () => {
    console.log('Updating');

    setFormMode && setFormMode('update');
    setSearchKey && setSearchKey(data.login);

    console.log('Search Key Set =>, ', data.login);
  };

  const onDelete = () => {
    console.log('Deleted!');
  };

  return (
    <tr className="bg-gray-50 text-center">
      {Object.values(data).map((value, index: number) => {
        return (
          <td className="px-16 py-2" key={index}>
            <span>{value}</span>
          </td>
        );
      })}

      <td className="px-16 py-2 flex justify-around gap-1">
        <button className="cursor" onClick={onUpdate}>
          <BiEdit size={25} color={'rgb(34, 197, 94)'}></BiEdit>
        </button>
        <button className="cursor" onClick={onDelete}>
          <BiTrashAlt size={25} color={'rgb(244, 63, 94)'}></BiTrashAlt>
        </button>
      </td>
    </tr>
  );
}
