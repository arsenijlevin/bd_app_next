import { Component } from 'react';

import { BiEdit, BiTrashAlt } from 'react-icons/bi';

import { UserData } from '../prisma/controller';

export async function getServerSideProps(): Promise<{
  props?: UserData[];
}> {
  const response = await fetch('http://localhost:8080/api/users/getAll', {
    method: 'POST'
  });
  const responseJSON: UserData[] = await response.json();
  console.log(responseJSON);

  return {
    props: responseJSON
  };
}

export default class Table extends Component<UserData[]> {
  render() {
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
          {this.props.map((user, index) => {
            return <Tr {...user} key={index}></Tr>;
          })}
        </tbody>
      </table>
    );
  }
}

function Tr(data: UserData) {
  return (
    <tr className="bg-gray-50 text-center">
      <td className="px-16 py-2 flex flex-row items-center">
        <span>{data.login}</span>
      </td>
      <td className="px-16 py-2">
        <span>{data.password}</span>
      </td>
      <td className="px-16 py-2">
        <span>{data.name}</span>
      </td>
      <td className="px-16 py-2">
        <span>{data.rights_id}</span>
      </td>
      <td className="px-16 py-2 flex justify-around gap-1">
        <button className="cursor">
          <BiEdit size={25} color={'rgb(34, 197, 94)'}></BiEdit>
        </button>
        <button className="cursor">
          <BiTrashAlt size={25} color={'rgb(244, 63, 94)'}></BiTrashAlt>
        </button>
      </td>
    </tr>
  );
}
