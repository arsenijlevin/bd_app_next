import { DateTime } from 'luxon';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { ChangeEvent, FormEvent, useState } from 'react';
import ServicesInfo from '../../components/accountant/ServicesInfo';
import Table from '../../components/accountant/Table';
import Logout from '../../components/auth/Logout';
import BackButton from '../../components/utility/BackButton';
import { getServicesByDateAndDepartments as getServicesByDateAndDepartments } from '../../lib/accountant/services';
import { getInitialProps, Rights } from '../../lib/auth/helpers';
import { renderedServicesJoined } from '../../prisma/controllers/accountantController';
import { prisma } from '../../prisma/db';
import Select from 'react-select';

interface IAccountantDepartmentsPageProps {
  departments: {
    title: string;
    id: number;
  }[];
}

interface DepartmentOption {
  value: number;
  label: string;
}

export const getServerSideProps: GetServerSideProps<
  IAccountantDepartmentsPageProps
> = async (ctx: GetServerSidePropsContext) => {
  getInitialProps(ctx, [Rights.ADMIN, Rights.ACCOUNTANT]);

  const departments = await prisma.departments.findMany({});

  return {
    props: {
      departments: departments.map(department => ({
        title: department.title,
        id: department.id
      }))
    }
  };
};

export default function AccountantDepartments({
  departments
}: IAccountantDepartmentsPageProps) {
  const [formData, setFormData] = useState({
    date: DateTime.now().toFormat('yyyy-MM'),
    departmentIds: [] as number[]
  });

  const [servicesData, setServicesData] = useState(
    [] as renderedServicesJoined[]
  );

  const optionList = departments.map(department => {
    return {
      value: department.id,
      label: department.title
    };
  });

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setServicesData(
      await getServicesByDateAndDepartments(
        formData.date,
        formData.departmentIds
      )
    );
  };

  const handleSelect = (option: readonly DepartmentOption[]) => {
    formData.departmentIds = option.map(opt => opt.value);
  };

  return (
    <section className="py-5 px-10 container mx-auto">
      <Head>
        <title>Генерация отчётов - по отделениям</title>
      </Head>
      <h2 className="text-xl md:text-5xl text-center font-bold py-10">
        Генерация отчётов - по отделениям
      </h2>
      <div className="left flex gap-3">
        <Logout></Logout>
      </div>
      <BackButton></BackButton>

      <form onSubmit={onSubmit}>
        <div className="container flex justify-between py-5 flex-col gap-2 w-96">
          <h3>Выберите дату: </h3>
          <input
            type="month"
            name="date"
            id="date"
            min="2020-01"
            max={DateTime.now().toFormat('yyyy-MM')}
            defaultValue={DateTime.now().toFormat('yyyy-MM')}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setFormData &&
                setFormData(
                  Object.assign(formData, { date: event.target.value })
                );
            }}
          />
        </div>

        <div className="container flex justify-between py-5 flex-col gap-2 w-96">
          <Select
            options={optionList}
            placeholder="Отделения"
            isMulti
            onChange={handleSelect}
            isSearchable={true}
            noOptionsMessage={() => 'Не найдено'}
          />
        </div>
        <div className="container mx-auto flex justify-between py-5 flex-col gap-2">
          <button
            type="submit"
            className="text-md w-1/6 mt-5 bg-green-500 text-black px-4 py-2 border rounded-md hover:bg-gray-50 hover:border-green-500 hover:text-green-500"
          >
            Готово
          </button>
        </div>
      </form>

      {servicesData.length > 0 && (
        <ServicesInfo services={servicesData}></ServicesInfo>
      )}

      <div className="container mx-auto flex justify-between py-5 flex-col gap-2">
        <h3>Результат: </h3>
        {servicesData.length > 0 ? (
          <Table
            headers={[
              'Дата и время',
              'Услуга',
              'Специалист',
              'Пациент',
              'Стоимость услуги',
              'Результат'
            ]}
            data={servicesData}
          ></Table>
        ) : (
          <p>По запросу не найдено ни одной записи</p>
        )}
      </div>
    </section>
  );
}
