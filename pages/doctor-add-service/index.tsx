import { ChangeEvent, FormEvent, useState } from 'react';
import { useMutation } from 'react-query';

import Loading from '../../components/utility/Loading';
import Error from '../../components/utility/Error';
import Success from '../../components/utility/Success';

import { addRenderedService } from '../../lib/rendered-services/helper';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { doctorToString } from '../../lib/doctors/helpers';

import { prisma } from '../../prisma/db';

interface IDoctorsAddServicePageProps {
  doctors: {
    name: string;
    id: number;
  }[];
  services: {
    title: string;
    id: number;
  }[];
}

export interface IDoctorAddServiceForm {
  doctorId: string;
  serviceId: string;
  patientId: string;
  result: string;
}

export const getServerSideProps: GetServerSideProps<
  IDoctorsAddServicePageProps
> = async () => {
  const doctors = await prisma.doctors.findMany();
  const services = await prisma.services.findMany();

  return {
    props: {
      doctors: doctors.map(doctor => ({
        name: doctorToString(doctor),
        id: doctor.id
      })),
      services: services.map(service => ({
        title: service.title,
        id: service.id
      }))
    }
  };
};

export default function DoctorAddService({
  doctors,
  services
}: IDoctorsAddServicePageProps) {
  const [formData, setFormData] = useState<IDoctorAddServiceForm>(
    {} as IDoctorAddServiceForm
  );
  const addMutation = useMutation(addRenderedService);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    addMutation.mutate(formData);

    setTimeout(() => {
      addMutation.reset();
      setFormData && setFormData({} as IDoctorAddServiceForm);
    }, 2000);
  };

  if (addMutation.isLoading) return <Loading></Loading>;
  if (addMutation.isError)
    return <Error message="Ошибка при выполнении запроса"></Error>;

  if (addMutation.isSuccess) return <Success message="Успешно!"></Success>;

  return (
    <section className="py-5 container mx-auto">
      <Head>
        <title>Учёт оказанной услуги</title>
      </Head>
      <h2 className="text-xl md:text-5xl text-center font-bold py-10">
        Учёт оказанной услуги
      </h2>

      <form className="grid lg:grid-cols-2 w-2/3 gap-4" onSubmit={handleSubmit}>
        <div className="input-type hidden">
          <input
            type="number"
            name="id"
            placeholder="ID"
            className="border w-full px-5 py-3 focus:outline-none rounded-md"
          />
        </div>
        <div className="container flex justify-between py-5 flex-col gap-2 w-96">
          <h3>Выберите врача: </h3>
          <select
            className="border w-full px-5 py-3 focus:outline-none rounded-md"
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

        <div className="container flex justify-between py-5 flex-col gap-2 w-96">
          <h3>Выберите услугу: </h3>
          <select
            className="border w-full px-5 py-3 focus:outline-none rounded-md"
            name="serviceId"
            id="serviceId"
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              setFormData &&
                setFormData(
                  Object.assign(formData, {
                    serviceId:
                      event.target[event.target.selectedIndex].getAttribute(
                        'data-id'
                      )
                  })
                );
            }}
          >
            <option data-id={-1}>-</option>
            {services?.map((service, index) => {
              return (
                <option key={index} data-id={service.id}>
                  {service.title}
                </option>
              );
            })}
          </select>
        </div>

        <div className="container flex gap-2 py-5 flex-col w-96">
          <h3>ID пациента: </h3>
          <input
            className="border w-full px-5 py-3 focus:outline-none rounded-md"
            name="serviceId"
            id="serviceId"
            type="number"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setFormData &&
                setFormData(
                  Object.assign(formData, {
                    patientId: event.target.value
                  })
                );
            }}
          ></input>
        </div>

        <div className="container flex justify-between py-5 flex-col gap-2 w-96">
          <h3>Результат оказания услуги: </h3>
          <textarea
            className="border w-full px-5 py-3 focus:outline-none rounded-md
            h-20 resize-x"
            name="result"
            id="result"
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
              setFormData &&
                setFormData(
                  Object.assign(formData, {
                    result: event.target.value
                  })
                );
            }}
          ></textarea>
        </div>

        <button
          type="submit"
          className="flex justify-center items-center text-md w-1/3 bg-green-500 text-black px-4 py-2 border rounded-md hover:bg-gray-50 hover:border-green-500 hover:text-green-500"
        >
          Добавить
        </button>
      </form>
    </section>
  );
}
