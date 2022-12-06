// import { BiCheck, BiX, BiUserPlus } from 'react-icons/bi';

import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { BiUserPlus } from 'react-icons/bi';
import { useQuery, useQueryClient } from 'react-query';
import Error from '../../components/utility/Error';
import Form from '../../components/doctors/Form';
import Loading from '../../components/utility/Loading';
import Table from '../../components/doctors/Table';

import { deleteDoctor, getDoctors } from '../../lib/doctors/helpers';
import { useQueryOptions } from '../../lib/useQueryOptions';
import { DoctorData } from '../../prisma/controllers/doctorsController';
import { IFormMode } from '../../lib/IFormMode';
import { IDeleteComponent } from '../../lib/IDeleteComponent';

const TABLE_NAME = 'doctors';
const FORM_MODE = 'add';
const SEARCH_KEY = -1;

export const KeyDoctorsContext = createContext<{
  formMode: IFormMode;
  doctorKey: number;
  doctorToUpdate: DoctorData | undefined;
  formData: DoctorData;
  deleteKey: number;

  setFormData?: Dispatch<SetStateAction<DoctorData>>;
  setFormMode?: Dispatch<SetStateAction<IFormMode>>;
  setDoctorKey?: Dispatch<SetStateAction<number>>;
  setDoctorToUpdate?: Dispatch<SetStateAction<DoctorData | undefined>>;
  setDeleteKey?: Dispatch<SetStateAction<number>>;
}>({
  formMode: FORM_MODE,
  doctorKey: SEARCH_KEY,
  doctorToUpdate: undefined,
  formData: {} as DoctorData,
  deleteKey: SEARCH_KEY
});

export default function DatabaseViewerDoctors() {
  const queryClient = useQueryClient();

  const [formMode, setFormMode] = useState<IFormMode>(FORM_MODE);
  const [doctorKey, setDoctorKey] = useState<number>(SEARCH_KEY);
  const [doctorToUpdate, setDoctorToUpdate] = useState<DoctorData | undefined>(
    undefined
  );
  const [formData, setFormData] = useState({} as DoctorData);
  const [deleteKey, setDeleteKey] = useState<number>(SEARCH_KEY);

  const { data, isLoading, isError } = useQuery(
    [TABLE_NAME],
    getDoctors,
    useQueryOptions
  );

  if (isLoading) return <Loading></Loading>;
  if (isError || !data)
    return <Error message="Ошибка при получении данных"></Error>;

  const openAddForm = () => {
    setFormMode(FORM_MODE);
    setDoctorKey(SEARCH_KEY);
    setDoctorToUpdate(undefined);
  };

  const deleteHandler = async () => {
    if (deleteKey !== -1) {
      await deleteDoctor(deleteKey);
      await queryClient.prefetchQuery('doctors', getDoctors);

      if (deleteKey === doctorToUpdate?.id) setFormMode('add');

      setDeleteKey(-1);
    }
  };

  const cancleHandler = async () => {
    setDeleteKey(-1);
  };

  return (
    <section className="py-5">
      <h2 className="text-xl md:text-5xl text-center font-bold py-10">Врачи</h2>

      <KeyDoctorsContext.Provider
        value={{
          formMode,
          doctorKey,
          doctorToUpdate,
          formData,
          deleteKey,
          setFormData,
          setFormMode,
          setDoctorKey,
          setDoctorToUpdate,
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
          {deleteKey !== -1 ? (
            DeleteComponent({ deleteHandler, cancleHandler, deleteKey })
          ) : (
            <></>
          )}
        </div>

        <div className="h-80 min-w-full">
          <Form></Form>
        </div>
        <div className="container mx-auto">
          <Table
            headers={[
              'ID',
              'Специальность',
              'Отделение',
              'Зарплата',
              'Имя',
              'Фамилия',
              'Отчество'
            ]}
            data={data}
          ></Table>
        </div>
      </KeyDoctorsContext.Provider>
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
