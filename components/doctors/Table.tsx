import { useContext } from 'react';
import { BiEdit, BiTrashAlt } from 'react-icons/bi';
import { KeyDoctorsContext } from '../../pages/database-viewer/doctors';
import { DoctorsJoined } from '../../prisma/controllers/doctorsController';

interface ITableProps {
  headers: string[];
  data: DoctorsJoined[];
}

interface ITableHeaderProps {
  headers: string[];
}

export default function Table({ headers, data }: ITableProps) {
  return (
    <table className="min-w-full table-auto">
      <TableHeader headers={headers}></TableHeader>
      <tbody className="bg-gray-200">
        {data.map((object: DoctorsJoined, index: number) => (
          <TableRow key={index} {...object} />
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

function TableRow(data: DoctorsJoined) {
  const { setDoctorKey, setFormMode, setDoctorToUpdate, setDeleteKey } =
    useContext(KeyDoctorsContext);

  const onUpdate = () => {
    setFormMode && setFormMode('update');
    setDoctorKey && setDoctorKey(data.id);
    setDoctorToUpdate && setDoctorToUpdate(data);
    window.scrollTo(0, 0);
  };

  const onDelete = () => {
    setDeleteKey && setDeleteKey(data.id);
  };
  /*
  [
              'ID',
              'Специальность',
              'Отделение',
              'Зарплата, руб.',
              'Имя',
              'Фамилия',
              'Отчество'
            ]
  */

  return (
    <tr className="bg-gray-50 text-center">
      <td className="px-2 py-2">
        <span>{data.id}</span>
      </td>
      <td className="px-2 py-2">
        <span>{`(${data.specialty_id}) ${data.specialties.title}`}</span>
      </td>
      <td className="px-2 py-2">
        <span>{`(${data.department_id}) ${data.departments.title}`}</span>
      </td>
      <td className="px-2 py-2">
        <span>{data.salary.toString()}</span>
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
      <td className="px-2 py-2 flex justify-around gap-1">
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
