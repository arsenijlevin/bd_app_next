// import { BiCheck, BiX, BiUserPlus } from 'react-icons/bi';

import { createContext, Dispatch, SetStateAction, useState } from 'react';
import Form from '../../components/Form';
import Table from '../../components/Table';
import {
  addUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser
} from '../../lib/helpers';

// import { useQueryClient } from 'react-query';
// import { deleteUser, getUsers } from '../lib/helpers';

export const KeyContext = createContext<{
  key: string;
  setKeyProperty: Dispatch<SetStateAction<string>>;
}>({
  key: '',
  setKeyProperty: () => {
    /* */
  }
});

export default function DatabaseViewer() {
  const [currentKey, setCurrentKey] = useState('');

  return (
    <section className="py-5">
      <h2 className="text-xl md:text-5xl text-center font-bold py-10">
        DatabaseViewer
      </h2>

      <div className="container mx-auto flex justify-between py-5 border-b">
        <div className="left flex gap-3">
          {/* {deleteId ? (
            DeleteComponent({ deleteHandler, cancleHandler, deleteId })
          ) : (
            <></>
          )} */}
        </div>
      </div>
      <KeyContext.Provider
        value={{ key: currentKey, setKeyProperty: setCurrentKey }}
      >
        <Form
          dataKey="users"
          inputData={[
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
          ]}
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
            data={[
              {
                asd: 'asd'
              }
            ]}
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
