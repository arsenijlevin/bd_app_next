// import { BiCheck, BiX, BiUserPlus } from 'react-icons/bi';

import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { BiUserPlus } from 'react-icons/bi';
import { useQuery, useQueryClient } from 'react-query';
import Error from '../../components/Error';
import Form from '../../components/Form';
import Loading from '../../components/Loading';
import Table from '../../components/Table';

import { deleteUser, getUsers, useQueryOptions } from '../../lib/helpers';
import { UserData } from '../../prisma/controller';

interface IDeleteComponent {
  deleteHandler: () => void;
  cancleHandler: () => void;
  deleteKey: string;
}

const TABLE_NAME = 'users';
const FORM_MODE = 'add';
const SEARCH_KEY = '';

export type IFormMode = 'update' | 'add';

export const KeyContext = createContext<{
  formMode: IFormMode;
  userKey: string;
  userToUpdate: UserData | undefined;
  formData: UserData;
  deleteKey: string;

  setFormData?: Dispatch<SetStateAction<UserData>>;
  setFormMode?: Dispatch<SetStateAction<IFormMode>>;
  setUserKey?: Dispatch<SetStateAction<string>>;
  setUserToUpdate?: Dispatch<SetStateAction<UserData | undefined>>;
  setDeleteKey?: Dispatch<SetStateAction<string>>;
}>({
  formMode: FORM_MODE,
  userKey: SEARCH_KEY,
  userToUpdate: undefined,
  formData: {} as UserData,
  deleteKey: ''
});

export default function DatabaseViewerUsers() {
  const queryClient = useQueryClient();

  const [formMode, setFormMode] = useState<IFormMode>(FORM_MODE);
  const [userKey, setUserKey] = useState<string>(SEARCH_KEY);
  const [userToUpdate, setUserToUpdate] = useState<UserData | undefined>(
    undefined
  );
  const [formData, setFormData] = useState({} as UserData);
  const [deleteKey, setDeleteKey] = useState<string>('');

  const { data, isLoading, isError } = useQuery(
    [TABLE_NAME],
    getUsers,
    useQueryOptions
  );

  if (isLoading) return <Loading></Loading>;
  if (isError || !data)
    return <Error message="Ошибка при получении данных"></Error>;

  const openAddForm = () => {
    setFormMode(FORM_MODE);
    setUserKey(SEARCH_KEY);
    setUserToUpdate(undefined);
  };

  const deleteHandler = async () => {
    if (deleteKey) {
      await deleteUser(deleteKey);
      await queryClient.prefetchQuery('users', getUsers);

      if (deleteKey === userToUpdate?.login) setFormMode('add');

      setDeleteKey('');
    }
  };

  const cancleHandler = async () => {
    setDeleteKey('');
  };

  return (
    <section className="py-5">
      <h2 className="text-xl md:text-5xl text-center font-bold py-10">
        Пользователи
      </h2>

      <KeyContext.Provider
        value={{
          formMode,
          userKey,
          userToUpdate,
          formData,
          deleteKey,
          setFormData,
          setFormMode,
          setUserKey,
          setUserToUpdate,
          setDeleteKey
        }}
      >
        <div className="container mx-auto flex justify-between py-5 border-b">
          <div className="left flex gap-3">
            <button
              onClick={openAddForm}
              className="flex bg-indigo-500 text-white px-4 py-2 border rounded-md hover:bg-indigo-300 hover:text-gray-800"
            >
              Добавить
              <span className="px-1">
                <BiUserPlus size={23}></BiUserPlus>
              </span>
            </button>
          </div>
          {deleteKey ? (
            DeleteComponent({ deleteHandler, cancleHandler, deleteKey })
          ) : (
            <></>
          )}
        </div>

        <div className="h-60 min-w-full">
          <Form></Form>
        </div>
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

function DeleteComponent({
  deleteHandler,
  cancleHandler,
  deleteKey
}: IDeleteComponent) {
  return (
    <div className="flex gap-5">
      <button>
        Удалить <span className="font-bold">{deleteKey}</span>?
      </button>
      <button
        onClick={deleteHandler}
        className="flex bg-indigo-500 text-white px-4 py-2 border rounded-md hover:bg-indigo-300 hover:text-gray-800"
      >
        Да{' '}
      </button>
      <button
        onClick={cancleHandler}
        className="flex bg-indigo-500 text-white px-4 py-2 border rounded-md hover:bg-indigo-300 hover:text-gray-800"
      >
        Нет{' '}
      </button>
    </div>
  );
}
