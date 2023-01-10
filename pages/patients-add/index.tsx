import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import Error from '../../components/utility/Error';
import Form from '../../components/patients/Form';
import Loading from '../../components/utility/Loading';
import Table from '../../components/patients/Table';

import { deletePatient, getPatients } from '../../lib/patients/helpers';
import { useQueryOptions } from '../../lib/useQueryOptions';
import { PatientData } from '../../prisma/controllers/patientsController';
import Head from 'next/head';

import { getInitialProps, Rights } from '../../lib/auth/helpers';
import { NextPageContext } from 'next';
import Logout from '../../components/auth/Logout';
import BackButton from '../../components/utility/BackButton';

interface IDeleteComponent {
  deleteHandler: () => void;
  cancleHandler: () => void;
  deleteKey: number;
}

const TABLE_NAME = 'patients';

const SEARCH_KEY = -1;

export const KeyPatientsContext = createContext<{
  patientKey: number;
  formData: PatientData;
  deleteKey: number;

  setFormData?: Dispatch<SetStateAction<PatientData>>;
  setPatientKey?: Dispatch<SetStateAction<number>>;
  setDeleteKey?: Dispatch<SetStateAction<number>>;
}>({
  patientKey: SEARCH_KEY,
  formData: {} as PatientData,
  deleteKey: -1
});

DatabaseViewerPatients.getInitialProps = (ctx: NextPageContext) =>
  getInitialProps(ctx, [Rights.ADMIN]);

export default function DatabaseViewerPatients() {
  const queryClient = useQueryClient();

  const [patientKey, setPatientKey] = useState<number>(SEARCH_KEY);

  const [formData, setFormData] = useState({} as PatientData);
  const [deleteKey, setDeleteKey] = useState<number>(-1);

  const { data, isLoading, isError } = useQuery(
    [TABLE_NAME],
    getPatients,
    useQueryOptions
  );

  if (isLoading) return <Loading></Loading>;
  if (isError || !data)
    return <Error message="Ошибка при получении данных"></Error>;

  const deleteHandler = async () => {
    if (deleteKey !== -1) {
      await deletePatient(deleteKey);
      await queryClient.prefetchQuery('patients', getPatients);

      setDeleteKey(-1);
    }
  };

  const cancleHandler = async () => {
    setDeleteKey(-1);
  };

  return (
    <section className="py-5 container mx-auto">
      <Head>
        <title>Пациенты</title>
      </Head>
      <h2 className="text-xl md:text-5xl text-center font-bold py-10">
        Пациенты
      </h2>

      <KeyPatientsContext.Provider
        value={{
          patientKey,
          formData,
          deleteKey,
          setFormData,
          setPatientKey,
          setDeleteKey
        }}
      >
        <div className="left flex gap-3">
          <Logout></Logout>
        </div>
        <BackButton link="/database-viewer"></BackButton>
        <div className="container mx-auto flex justify-between py-5 border-b">
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
          <Table
            headers={[
              'Email',
              'Имя',
              'Фамилия',
              'Отчество',
              'День рождения',
              'Пол',
              'Номер телефона'
            ]}
            data={data}
          ></Table>
        </div>
      </KeyPatientsContext.Provider>
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
