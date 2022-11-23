import { BiEdit, BiTrashAlt } from 'react-icons/bi';

import { UserData } from '../prisma/controller';

import { useSelector, useDispatch } from 'react-redux';
import { deleteAction, InitialState, updateAction } from '../redux/reducer';

import { toggleChangeAction } from '../redux/reducer';
import { useQuery } from 'react-query';
import { getUsers } from '../lib/helpers';

import Error from './Error';

export default function Table() {
  const { isLoading, isError, data } = useQuery('users', getUsers);

  if (isLoading) return <div>Загрузка...</div>;
  if (isError) return <Error message="Произошла ошибка"></Error>;

  return (
    <table className="min-w-full table-auto">
      <thead>
        <tr className="bg-gray-800">
          <th className="px-16 py-2">
            <span className="text-gray-200">Логин</span>
          </th>
          <th className="px-16 py-2">
            <span className="text-gray-200">Пароль</span>
          </th>
          <th className="px-16 py-2">
            <span className="text-gray-200">Имя пользователя</span>
          </th>
          <th className="px-16 py-2">
            <span className="text-gray-200">Права</span>
          </th>
          <th className="px-16 py-2">
            <span className="text-gray-200">Действия</span>
          </th>
        </tr>
      </thead>
      <tbody className="bg-gray-200">
        {data.map((object: UserData, index: number) => (
          <Tr {...object} key={index} />
        ))}
      </tbody>
    </table>
  );
}

function Tr(data: UserData) {
  const visible = useSelector(
    (state: { app: InitialState }) => state.app.client.toggleForm
  );
  const dispatch = useDispatch();

  const onUpdate = () => {
    dispatch(toggleChangeAction());

    if (!visible) {
      dispatch(updateAction(data.login));
    }
  };

  const onDelete = () => {
    if (!visible) {
      dispatch(deleteAction(data.login));
    }
  };

  return (
    <tr className="bg-gray-50 text-center">
      <td className="px-16 py-2 flex flex-row items-center">
        <span>{data.login}</span>
      </td>
      <td className="px-16 py-2 break-words max-w-sm">
        <span>{data.password}</span>
      </td>
      <td className="px-16 py-2 break-words max-w-sm">
        <span>{data.name}</span>
      </td>
      <td className="px-16 py-2">
        <span>{data.rights_id}</span>
      </td>
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
