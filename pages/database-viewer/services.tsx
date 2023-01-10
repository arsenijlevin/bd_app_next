// import { BiCheck, BiX, BiUserPlus } from 'react-icons/bi';

import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { MdMedicalServices } from 'react-icons/md';
import { useQuery, useQueryClient } from 'react-query';
import Error from '../../components/utility/Error';
import Form from '../../components/services/Form';
import Loading from '../../components/utility/Loading';
import Table from '../../components/services/Table';

import { deleteService, getServices } from '../../lib/services/helpers';
import { useQueryOptions } from '../../lib/useQueryOptions';
import { ServiceData } from '../../prisma/controllers/servicesController';
import { IFormMode } from '../../lib/interfaces/IFormMode';
import { IDeleteComponent } from '../../lib/interfaces/IDeleteComponent';
import Head from 'next/head';

import { getInitialProps, Rights } from '../../lib/auth/helpers';
import { NextPageContext } from 'next';
import Logout from '../../components/auth/Logout';
import BackButton from '../../components/utility/BackButton';

const TABLE_NAME = 'services';
const FORM_MODE = 'add';
const SEARCH_KEY = -1;

export const KeyServicesContext = createContext<{
  formMode: IFormMode;
  serviceKey: number;
  serviceToUpdate: ServiceData | undefined;
  formData: ServiceData;
  deleteKey: number;

  setFormData?: Dispatch<SetStateAction<ServiceData>>;
  setFormMode?: Dispatch<SetStateAction<IFormMode>>;
  setServiceKey?: Dispatch<SetStateAction<number>>;
  setServiceToUpdate?: Dispatch<SetStateAction<ServiceData | undefined>>;
  setDeleteKey?: Dispatch<SetStateAction<number>>;
}>({
  formMode: FORM_MODE,
  serviceKey: SEARCH_KEY,
  serviceToUpdate: undefined,
  formData: {} as ServiceData,
  deleteKey: SEARCH_KEY
});

DatabaseViewerServices.getInitialProps = (ctx: NextPageContext) =>
  getInitialProps(ctx, [Rights.ADMIN]);

export default function DatabaseViewerServices() {
  const queryClient = useQueryClient();

  const [formMode, setFormMode] = useState<IFormMode>(FORM_MODE);
  const [serviceKey, setServiceKey] = useState<number>(SEARCH_KEY);
  const [serviceToUpdate, setServiceToUpdate] = useState<
    ServiceData | undefined
  >(undefined);
  const [formData, setFormData] = useState({} as ServiceData);
  const [deleteKey, setDeleteKey] = useState<number>(SEARCH_KEY);

  const { data, isLoading, isError } = useQuery(
    [TABLE_NAME],
    getServices,
    useQueryOptions
  );

  if (isLoading) return <Loading></Loading>;
  if (isError || !data)
    return <Error message="Ошибка при получении данных"></Error>;

  const openAddForm = () => {
    setFormMode(FORM_MODE);
    setServiceKey(SEARCH_KEY);
    setServiceToUpdate(undefined);
  };

  const deleteHandler = async () => {
    if (deleteKey !== -1) {
      await deleteService(deleteKey);
      await queryClient.prefetchQuery('services', getServices);

      if (deleteKey === serviceToUpdate?.id) setFormMode('add');

      setDeleteKey(-1);
    }
  };

  const cancleHandler = async () => {
    setDeleteKey(-1);
  };

  return (
    <section className="py-5 container mx-auto">
      <Head>
        <title>Список услуг</title>
      </Head>
      <h2 className="text-xl md:text-5xl text-center font-bold py-10">
        Список услуг
      </h2>

      <KeyServicesContext.Provider
        value={{
          formMode,
          serviceKey,
          serviceToUpdate,
          formData,
          deleteKey,
          setFormData,
          setFormMode,
          setServiceKey,
          setServiceToUpdate,
          setDeleteKey
        }}
      >
        <div className="left flex gap-3">
          <Logout></Logout>
        </div>
        <BackButton link="/database-viewer"></BackButton>
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
          <Table
            headers={['ID', 'Название', 'Стоимость, руб.']}
            data={data}
          ></Table>
        </div>
      </KeyServicesContext.Provider>
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
