// import { BiCheck, BiX, BiUserPlus } from 'react-icons/bi';

import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { MdMedicalServices } from 'react-icons/md';
import { useQuery, useQueryClient } from 'react-query';
import Error from '../../components/utility/Error';
import Form from '../../components/departments/Form';
import Loading from '../../components/utility/Loading';
import Table from '../../components/departments/Table';

import {
  deleteDepartment,
  getDepartments
} from '../../lib/departments/helpers';
import { useQueryOptions } from '../../lib/useQueryOptions';
import { DepartmentData } from '../../prisma/controllers/departmentsController';
import { IFormMode } from '../../lib/interfaces/IFormMode';
import { IDeleteComponent } from '../../lib/interfaces/IDeleteComponent';
import Head from 'next/head';

import { getInitialProps, Rights } from '../../lib/auth/helpers';
import { NextPageContext } from 'next';
import Logout from '../../components/auth/Logout';
import BackButton from '../../components/utility/BackButton';

const TABLE_NAME = 'departments';
const FORM_MODE = 'add';
const SEARCH_KEY = -1;

export const KeyDepartmentsContext = createContext<{
  formMode: IFormMode;
  departmentKey: number;
  departmentToUpdate: DepartmentData | undefined;
  formData: DepartmentData;
  deleteKey: number;

  setFormData?: Dispatch<SetStateAction<DepartmentData>>;
  setFormMode?: Dispatch<SetStateAction<IFormMode>>;
  setDepartmentKey?: Dispatch<SetStateAction<number>>;
  setDepartmentToUpdate?: Dispatch<SetStateAction<DepartmentData | undefined>>;
  setDeleteKey?: Dispatch<SetStateAction<number>>;
}>({
  formMode: FORM_MODE,
  departmentKey: SEARCH_KEY,
  departmentToUpdate: undefined,
  formData: {} as DepartmentData,
  deleteKey: SEARCH_KEY
});

DatabaseViewerDepartments.getInitialProps = (ctx: NextPageContext) =>
  getInitialProps(ctx, [Rights.ADMIN]);

export default function DatabaseViewerDepartments() {
  const queryClient = useQueryClient();

  const [formMode, setFormMode] = useState<IFormMode>(FORM_MODE);
  const [departmentKey, setDepartmentKey] = useState<number>(SEARCH_KEY);
  const [departmentToUpdate, setDepartmentToUpdate] = useState<
    DepartmentData | undefined
  >(undefined);
  const [formData, setFormData] = useState({} as DepartmentData);
  const [deleteKey, setDeleteKey] = useState<number>(SEARCH_KEY);

  const { data, isLoading, isError } = useQuery(
    [TABLE_NAME],
    getDepartments,
    useQueryOptions
  );

  if (isLoading) return <Loading></Loading>;
  if (isError || !data)
    return <Error message="Ошибка при получении данных"></Error>;

  const openAddForm = () => {
    setFormMode(FORM_MODE);
    setDepartmentKey(SEARCH_KEY);
    setDepartmentToUpdate(undefined);
  };

  const deleteHandler = async () => {
    if (deleteKey !== -1) {
      await deleteDepartment(deleteKey);
      await queryClient.prefetchQuery('departments', getDepartments);

      if (deleteKey === departmentToUpdate?.id) setFormMode('add');

      setDeleteKey(-1);
    }
  };

  const cancleHandler = async () => {
    setDeleteKey(-1);
  };

  return (
    <section className="py-5 px-10 container mx-auto">
      <Head>
        <title>Список отделений</title>
      </Head>
      <h2 className="text-xl md:text-5xl text-center font-bold py-10">
        Список отделений
      </h2>

      <KeyDepartmentsContext.Provider
        value={{
          formMode,
          departmentKey,
          departmentToUpdate,
          formData,
          deleteKey,
          setFormData,
          setFormMode,
          setDepartmentKey,
          setDepartmentToUpdate,
          setDeleteKey
        }}
      >
        <div className="left flex gap-3">
          <Logout></Logout>
        </div>
        <BackButton></BackButton>
        <div className="container mx-auto flex justify-between py-5 border-b">
          <div className="flex left text-md ">
            <button
              onClick={openAddForm}
              className="flex bg-indigo-500 text-white px-4 py-2 border rounded-md hover:bg-indigo-300 hover:text-gray-800"
            >
              Добавить
              <span className="ml-2">
                <MdMedicalServices size={20}></MdMedicalServices>
              </span>
            </button>
          </div>
          {deleteKey !== -1 ? (
            DeleteComponent({ deleteHandler, cancleHandler, deleteKey })
          ) : (
            <></>
          )}
        </div>

        <div className="min-w-full">
          <Form></Form>
        </div>
        <div className="container mx-auto">
          <Table headers={['ID', 'Название', 'Этаж']} data={data}></Table>
        </div>
      </KeyDepartmentsContext.Provider>
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
        Удалить врача с ID <span className="font-bold">{deleteKey}</span>?
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
