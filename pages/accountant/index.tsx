import { departments, doctors } from '@prisma/client';
import { DateTime } from 'luxon';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { ChangeEvent, FormEvent, useState } from 'react';
import { getServicesByDate } from '../../lib/accountant/services';
import { doctorToString, patientToString } from '../../lib/doctors/helpers';
import { renderedServicesJoined } from '../../prisma/controllers/accountantController';
import { prisma } from '../../prisma/db';

interface IAccountantPageProps {
  doctorNames: doctors['name'][] | undefined;
  departmentTitles: departments['title'][] | undefined;
}

interface IAccountantPageFormData {
  date: string;
  doctor: string;
  department: string;
}

export const getServerSideProps: GetServerSideProps<
  IAccountantPageProps
> = async () => {
  const doctors = await prisma?.doctors.findMany();
  const departments = await prisma?.departments.findMany({});

  return {
    props: {
      doctorNames: doctors.map(doctor => doctorToString(doctor)),
      departmentTitles: departments.map(department => department.title)
    }
  };
};

export default function Accountant({
  doctorNames: doctors,
  departmentTitles: departments
}: IAccountantPageProps) {
  const [formData, setFormData] = useState({} as IAccountantPageFormData);
  const [servicesData, setServicesData] = useState(
    [] as renderedServicesJoined[]
  );

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    console.log(servicesData);
    console.log(formData.date);

    setServicesData(await getServicesByDate(formData.date));

    console.log(servicesData);
  };

  return (
    <section className="py-5">
      <Head>
        <title>Генерация отчётов</title>
      </Head>
      <h2 className="text-xl md:text-5xl text-center font-bold py-10">
        Генерация отчётов
      </h2>

      <form onSubmit={onSubmit}>
        <div className="container mx-auto flex justify-between py-5 flex-col gap-2">
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
        <div className="container mx-auto flex justify-between py-5 flex-col gap-2">
          <h3>Выберите врача: </h3>
          <select
            name=""
            id=""
            className="w-96"
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              setFormData &&
                setFormData(
                  Object.assign(formData, { doctor: event.target.value })
                );
            }}
          >
            <option>-</option>
            {doctors?.map((doctor, index) => {
              return <option key={index}>{doctor}</option>;
            })}
          </select>
        </div>
        <div className="container mx-auto flex justify-between py-5 flex-col gap-2">
          <h3>Выберите отделение: </h3>
          <select
            name=""
            id=""
            className="w-96"
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              setFormData &&
                setFormData(
                  Object.assign(formData, { department: event.target.value })
                );
            }}
          >
            <option>-</option>
            {departments?.map((department, index) => {
              return <option key={index}>{department}</option>;
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
      <div className="container mx-auto flex justify-between py-5 flex-col gap-2">
        <h3>Результат: </h3>
        {servicesData.length > 0 &&
          servicesData.map((service, index) => {
            return (
              <div key={index} className="flex flex-row gap-2">
                <p>{service.date_time.toString()}</p>
                <p>{doctorToString(service.doctors)}</p>
                <p>{patientToString(service.patients)}</p>
              </div>
            );
          })}
      </div>
    </section>
  );
}
