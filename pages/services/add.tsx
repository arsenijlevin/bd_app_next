import { GetServerSideProps } from 'next';
import React, { Component, FormEvent } from 'react';
import styles from '../../components/service/add-form/addForm.module.scss';

import { PrismaClient } from '@prisma/client';
import Select from '../../components/utility/Select';
import { DateTime } from 'luxon';

const prisma = new PrismaClient();

export type ServiceFormData = {
  dateAndTime: string;
  doctor: string;
  patient: string;
  service: string;
  result: string;
};

type Props = {
  server?: {
    doctors: string[];
    services: string[];
  };
};

const submitService = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const formElement = event.target as HTMLFormElement;
  const data: FormData = new FormData(formElement);
  const formObject = Object.fromEntries(data.entries()) as ServiceFormData;

  formObject.dateAndTime = DateTime.now().toFormat('yyyy-LL-dd HH:mm:ss');

  const response = await fetch('/api/addRenderedService', {
    method: 'POST',
    body: JSON.stringify(formObject)
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
};

export const getServerSideProps: GetServerSideProps = async () => {
  const doctors = await prisma.doctors.findMany({
    orderBy: {
      surname: 'asc'
    },
    select: {
      surname: true,
      id: true
    }
  });

  const services = await prisma.services.findMany({
    orderBy: {
      title: 'asc'
    },
    select: {
      title: true
    }
  });

  return {
    props: {
      server: {
        doctors: doctors.map(doctor => `${doctor.surname} (${doctor.id})`),
        services: services.map(service => service.title)
      }
    }
  };
};
export default class Services extends Component<Props> {
  render() {
    return (
      <div>
        <h2 className={styles['add-form-title']}>
          Добавление оказанной услуги
        </h2>
        <form onSubmit={submitService} className={styles['add-form']}>
          <div className={styles['input-block']}>
            <label htmlFor="doctor">Врач</label>
            <Select
              options={this.props.server?.doctors || []}
              id="doctor"
            ></Select>
          </div>
          <div className={styles['input-block']}>
            <label htmlFor="patient">Пациент</label>
            <input type="text" name="patient"></input>
          </div>
          <div className={styles['input-block']}>
            <label htmlFor="service">Услуга</label>
            <Select
              options={this.props.server?.services || []}
              id="service"
            ></Select>
          </div>
          <div className={styles['input-block']}>
            <label htmlFor="result">Результат</label>
            <input type="text" name="result"></input>
          </div>
          <div className={styles['input-block']}>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    );
  }
}
