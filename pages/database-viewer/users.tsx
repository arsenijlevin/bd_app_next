// import { BiCheck, BiX, BiUserPlus } from 'react-icons/bi';

import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { BiUserPlus } from 'react-icons/bi';
import { useQuery, useQueryClient } from 'react-query';
import Error from '../../components/utility/Error';
import Form from '../../components/users/Form';
import Loading from '../../components/utility/Loading';
import Table from '../../components/users/Table';

import { deleteUser, getUsers } from '../../lib/users/helpers';
import { useQueryOptions } from '../../lib/useQueryOptions';
import { UserData } from '../../prisma/controllers/usersController';
import Head from 'next/head';

import { getInitialProps, Rights } from '../../lib/auth/helpers';
import { NextPageContext } from 'next';
import Logout from '../../components/auth/Logout';

interface IDeleteComponent {
  deleteHandler: () => void;
  cancleHandler: () => void;
  deleteKey: string;
}

const TABLE_NAME = 'users';
const FORM_MODE = 'add';
const SEARCH_KEY = '';

export type IFormMode = 'update' | 'add';

export const KeyUsersContext = createContext<{
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

DatabaseViewerUsers.getInitialProps = (ctx: NextPageContext) =>
  getInitialProps(ctx, [Rights.ADMIN]);

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
      <Head>
        <title>Пользователи</title>
      </Head>
      <h2 className="text-xl md:text-5xl text-center font-bold py-10">
        Пользователи
      </h2>

      <KeyUsersContext.Provider
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
        <div className="left flex gap-3">
          <Logout></Logout>
        </div>
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
      </KeyUsersContext.Provider>
    </section>
  );
}

function DeleteComponent({
  deleteHandler,
  cancleHandler,
  deleteKey
}: IDeleteComponent) {
  return (
    <div className="flex gap-5 fixed top-10 right-20 bg-white px-4 py-4 border-black border-solid border ">
      <button>
        Удалить пользователя <span className="font-bold">{deleteKey}</span>?
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
