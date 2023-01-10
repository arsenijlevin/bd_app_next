import { DateTime } from 'luxon';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { ChangeEvent, FormEvent, useState } from 'react';
import Select from 'react-select';
import ServicesInfo from '../../components/accountant/ServicesInfo';
import Table from '../../components/accountant/Table';
import Logout from '../../components/auth/Logout';
import BackButton from '../../components/utility/BackButton';
import { getServicesByDateAndDoctors } from '../../lib/accountant/services';
import { getInitialProps, Rights } from '../../lib/auth/helpers';
import { doctorToString } from '../../lib/doctors/helpers';
import { renderedServicesJoined } from '../../prisma/controllers/accountantController';
import { prisma } from '../../prisma/db';

interface IAccountantDoctorsPageProps {
  doctors: {
    name: string;
    id: number;
  }[];
}

interface DoctorOption {
  value: number;
  label: string;
}

export const getServerSideProps: GetServerSideProps<
  IAccountantDoctorsPageProps
> = async (ctx: GetServerSidePropsContext) => {
  getInitialProps(ctx, [Rights.ADMIN, Rights.ACCOUNTANT]);

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

export default function AccountantDoctors({
  doctors
}: IAccountantDoctorsPageProps) {
  const [formData, setFormData] = useState({
    date: DateTime.now().toFormat('yyyy-MM'),
    doctorIds: [] as number[]
  });
  const [servicesData, setServicesData] = useState(
    [] as renderedServicesJoined[]
  );

  const optionList = doctors.map(doctor => {
    return {
      value: doctor.id,
      label: doctor.name
    };
  });

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setServicesData(
      await getServicesByDateAndDoctors(formData.date, formData.doctorIds)
    );
  };

  const handleSelect = (option: readonly DoctorOption[]) => {
    formData.doctorIds = option.map(opt => opt.value);
  };

  return (
    <section className="py-5 container mx-auto">
      <Head>
        <title>Генерация отчётов - по врачам</title>
      </Head>
      <h2 className="text-xl md:text-5xl text-center font-bold py-10">
        Генерация отчётов - по врачам
      </h2>
      <div className="left flex gap-3">
        <Logout></Logout>
      </div>
      <BackButton link="/accountant"></BackButton>
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
            placeholder="Врачи"
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

        {servicesData.length > 0 && formData.doctorIds.length > 0 ? (
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
