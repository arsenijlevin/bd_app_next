import { Component } from 'react';

import { BiEdit, BiTrashAlt } from 'react-icons/bi';

export default class Table extends Component {
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
          <tr className="bg-gray-50 text-center">
            <td className="px-16 py-2 flex flex-row items-center">
              <span>Тест логин</span>
            </td>
            <td className="px-16 py-2">
              <span>Тест пароль</span>
            </td>
            <td className="px-16 py-2">
              <span>Тест имя пользователя</span>
            </td>
            <td className="px-16 py-2">
              <span>Тест права</span>
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
        </tbody>
      </table>
    );
  }
}
