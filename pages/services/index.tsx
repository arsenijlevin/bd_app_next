import { GetServerSideProps } from 'next';
import React, { Component } from 'react';

import { prisma } from '../../prisma/db';

import Table from '../../components/table/Table';

type Props = {
  server: {
    databaseData: string[][];
  };
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const servicesData = await prisma.rendered_services.findMany({
    orderBy: {
      date_time: 'desc'
    },
    take: 20,
    include: {
      doctors: {
        select: {
          name: true,
          surname: true,
          patronymic: true
        }
      },
      patients: {
        select: {
          name: true,
          surname: true,
          patronymic: true
        }
      },
      services: {
        select: {
          title: true
        }
      }
    }
  });

  return {
    props: {
      server: {
        databaseData: servicesData.map(service => [
          `${service.date_time.toLocaleString()}`,
          `${service.doctors.surname} ${service.doctors.name} ${service.doctors.patronymic}`,
          `${service.patients.surname} ${service.patients.name} ${service.patients.patronymic}`,
          `${service.services.title}`,
          `${service.result}`
        ])
      }
    }
  };
};

export default class Services extends Component<Props> {
  render() {
    console.log(this.props.server.databaseData);

    return (
      <Table
        data={this.props.server.databaseData}
        headerTitles={[
          'Дата и время',
          'Врач',
          'Пациент',
          'Услуга',
          'Результат'
        ]}
      ></Table>
    );
  }
}
