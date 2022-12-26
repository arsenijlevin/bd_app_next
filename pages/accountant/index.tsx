import { departments, doctors } from '@prisma/client';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { doctorToString } from '../../lib/doctors/helpers';
import { prisma } from '../../prisma/db';

interface AccountantPageProps {
  doctorNames: doctors['name'][] | undefined;
  departmentTitles: departments['title'][] | undefined;
}

export const getServerSideProps: GetServerSideProps<
  AccountantPageProps
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
}: AccountantPageProps) {
  return (
    <section className="py-5">
      <Head>
        <title>Генерация отчётов</title>
      </Head>
      <h2 className="text-xl md:text-5xl text-center font-bold py-10">
        Генерация отчётов
      </h2>

      <div className="container mx-auto flex justify-between py-5 border-b">
        <h3>Выберите дату: </h3>
        <input type="date" />
      </div>
      <div className="container mx-auto flex justify-between py-5 border-b">
        <h3>Выберите время: </h3>
        <input type="time" name="" id="" />
      </div>
      <div className="container mx-auto flex justify-between py-5 border-b">
        <h3>Выберите врача: </h3>
        <select name="" id="" className="w-96">
          <option>-</option>
          {doctors?.map((doctor, index) => {
            return <option key={index}>{doctor}</option>;
          })}
        </select>
      </div>
      <div className="container mx-auto flex justify-between py-5 border-b">
        <h3>Выберите отделение: </h3>
        <select name="" id="" className="w-96">
          <option>-</option>
          {departments?.map((department, index) => {
            return <option key={index}>{department}</option>;
          })}
        </select>
      </div>
    </section>
  );
}
