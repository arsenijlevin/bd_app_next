import { DateTime } from 'luxon';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { ChangeEvent, FormEvent, useState } from 'react';
import ServicesInfo from '../../components/accountant/ServicesInfo';
import Table from '../../components/accountant/Table';
import { getServicesByDateAndDepartment } from '../../lib/accountant/services';
import { renderedServicesJoined } from '../../prisma/controllers/accountantController';
import { prisma } from '../../prisma/db';

interface IAccountantDepartmentsPageProps {
  departments: {
    title: string;
    id: number;
  }[];
}

export const getServerSideProps: GetServerSideProps<
  IAccountantDepartmentsPageProps
> = async () => {
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

export default function Accountant({
  departments
}: IAccountantDepartmentsPageProps) {
  const [formData, setFormData] = useState({
    date: DateTime.now().toFormat('yyyy-MM'),
    departmentId: -1
  });
  const [servicesData, setServicesData] = useState(
    [] as renderedServicesJoined[]
  );

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setServicesData(
      await getServicesByDateAndDepartment(formData.date, formData.departmentId)
    );
  };

  return (
    <section className="py-5 container mx-auto">
      <Head>
        <title>Генерация отчётов - отделения</title>
      </Head>
      <h2 className="text-xl md:text-5xl text-center font-bold py-10">
        Генерация отчётов
      </h2>

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
          <h3>Выберите отделение: </h3>
          <select
            name="departmentId"
            id="departmentId"
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              setFormData &&
                setFormData(
                  Object.assign(formData, {
                    departmentId:
                      event.target[event.target.selectedIndex].getAttribute(
                        'data-id'
                      )
                  })
                );
            }}
          >
            <option data-id={-1}>-</option>
            {departments?.map((department, index) => {
              return (
                <option key={index} data-id={department.id}>
                  {department.title}
                </option>
              );
            })}
          </select>
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
        {servicesData.length > 0 && (
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
        )}
      </div>
    </section>
  );
}
