import { DateTime } from 'luxon';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { ChangeEvent, FormEvent, useState } from 'react';
import ServicesInfo from '../../components/accountant/ServicesInfo';
import Table from '../../components/accountant/Table';
import { getServicesByDateAndDoctor } from '../../lib/accountant/services';
import { doctorToString } from '../../lib/doctors/helpers';
import { renderedServicesJoined } from '../../prisma/controllers/accountantController';
import { prisma } from '../../prisma/db';

interface IAccountantDoctorsPageProps {
  doctors: {
    name: string;
    id: number;
  }[];
}

export const getServerSideProps: GetServerSideProps<
  IAccountantDoctorsPageProps
> = async () => {
  const doctors = await prisma.doctors.findMany();

  return {
    props: {
      doctors: doctors.map(doctor => ({
        name: doctorToString(doctor),
        id: doctor.id
      }))
    }
  };
};

export default function Accountant({ doctors }: IAccountantDoctorsPageProps) {
  const [formData, setFormData] = useState({
    date: DateTime.now().toFormat('yyyy-MM'),
    doctorId: -1
  });
  const [servicesData, setServicesData] = useState(
    [] as renderedServicesJoined[]
  );

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setServicesData(
      await getServicesByDateAndDoctor(formData.date, formData.doctorId)
    );
  };

  return (
    <section className="py-5 container mx-auto">
      <Head>
        <title>Генерация отчётов - врачи</title>
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
          <h3>Выберите врача: </h3>
          <select
            name="doctorId"
            id="doctorId"
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              setFormData &&
                setFormData(
                  Object.assign(formData, {
                    doctorId:
                      event.target[event.target.selectedIndex].getAttribute(
                        'data-id'
                      )
                  })
                );
            }}
          >
            <option data-id={-1}>-</option>
            {doctors?.map((doctor, index) => {
              return (
                <option key={index} data-id={doctor.id}>
                  {doctor.name}
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

        {servicesData.length > 0 && formData.doctorId !== -1 && (
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
