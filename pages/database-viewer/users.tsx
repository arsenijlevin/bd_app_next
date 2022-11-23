// import { BiCheck, BiX, BiUserPlus } from 'react-icons/bi';

import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { BiUserPlus } from 'react-icons/bi';
import { useQuery } from 'react-query';
import Error from '../../components/Error';
import Form from '../../components/Form';
import Table from '../../components/Table';
import { IInputData } from '../../components/UpdateDataForm';
import {
  addUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  useQueryOptions
} from '../../lib/helpers';

// import { useQueryClient } from 'react-query';
// import { deleteUser, getUsers } from '../lib/helpers';

const QUERY_KEY = 'users';
const FORM_MODE = 'add';
const SEARCH_KEY = '';
const INPUT_DATA = [
  {
    placeholder: 'Логин'
  },
  {
    placeholder: 'Пароль'
  },
  {
    placeholder: 'Имя пользователя'
  },
  {
    placeholder: 'Права'
  }
];
const FORM_NAMES = ['login', 'password', 'name', 'rights_id'];
export type IFormMode = 'update' | 'add';

export const KeyContext = createContext<{
  queryKey: string;
  formMode: IFormMode;
  searchKey: string | number;
  inputData: IInputData[];
  formNames: string[];

  setFormMode?: Dispatch<SetStateAction<IFormMode>>;
  setSearchKey?: Dispatch<SetStateAction<string | number>>;
}>({
  queryKey: QUERY_KEY,
  formMode: FORM_MODE,
  searchKey: SEARCH_KEY,
  inputData: INPUT_DATA,
  formNames: FORM_NAMES
});

export default function DatabaseViewerUsers() {
  const [queryKey] = useState<string>(QUERY_KEY);
  const [inputData] = useState<IInputData[]>(INPUT_DATA);
  const [formMode, setFormMode] = useState<IFormMode>(FORM_MODE);
  const [searchKey, setSearchKey] = useState<string | number>(SEARCH_KEY);
  const [formNames] = useState<string[]>(FORM_NAMES);

  const { data } = useQuery([queryKey], getUsers, useQueryOptions);

  if (!data) return <Error message="Ошибка при получении данных"></Error>;

  const addButtonOnClickHandler = () => {
    console.log(formMode);

    setFormMode('add');
  };

  return (
    <section className="py-5">
      <h2 className="text-xl md:text-5xl text-center font-bold py-10">
        DatabaseViewer
      </h2>

      <KeyContext.Provider
        value={{
          queryKey,
          formMode,
          searchKey,
          inputData,
          formNames,
          setFormMode,
          setSearchKey
        }}
      >
        <div className="container mx-auto flex justify-between py-5 border-b">
          <div className="left flex gap-3">
            <button
              onClick={addButtonOnClickHandler}
              className="flex bg-indigo-500 text-white px-4 py-2 border rounded-md hover:bg-indigo-300 hover:text-gray-800"
            >
              Добавить
              <span className="px-1">
                <BiUserPlus size={23}></BiUserPlus>
              </span>
            </button>
          </div>
        </div>
        <Form
          CRUDFunctions={{
            getAll: getUsers,
            get: getUser,
            set: addUser,
            update: updateUser,
            delete: deleteUser
          }}
        ></Form>

        <div className="container mx-auto">
          <Table
            headers={['Логин', 'Пароль', 'Имя пользователя', 'Права']}
            data={data}
          ></Table>
        </div>
      </KeyContext.Provider>
    </section>
  );
}

// function DeleteComponent({
//   deleteHandler,
//   cancleHandler,
//   deleteId
// }: {
//   deleteHandler: () => void;
//   cancleHandler: () => void;
//   deleteId: string;
// }) {
//   return (
//     <div className="flex gap-5">
//       <button>
//         Удалить <span className="font-bold">{deleteId}</span>?
//       </button>
//       <button
//         onClick={deleteHandler}
//         className="flex bg-red-500 text-white px-4 py-2 border rounded-md hover:bg-rose-500 hover:border-red-500 hover:text-gray-50"
//       >
//         Да{' '}
//         <span className="px-1">
//           <BiX color="rgb(255 255 255)" size={25} />
//         </span>
//       </button>
//       <button
//         onClick={cancleHandler}
//         className="flex bg-green-500 text-white px-4 py-2 border rounded-md hover:bg-gree-500 hover:border-green-500 hover:text-gray-50"
//       >
//         Нет{' '}
//         <span className="px-1">
//           <BiCheck color="rgb(255 255 255)" size={25} />
//         </span>
//       </button>
//     </div>
//   );
// }
