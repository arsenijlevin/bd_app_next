import { GetServerSideProps } from 'next';
import React, { Component } from 'react';
import Table from '../components/table/Table';

import { prisma } from '../prisma/db';

type Props = {
  maxRows: number;
  server: {
    databaseData: string[][];
  };
};

export const getServerSideProps: GetServerSideProps = async () => {
  const allUsers = await prisma.users.findMany();

  return {
    props: {
      server: {
        databaseData: allUsers.map(user => Object.values(user))
      }
    }
  };
};

export default class DatabaseViewer extends Component<Props> {
  render() {
    return (
      <div>
        <Table
          headerTitles={['Имя', 'Пароль', 'Логин', 'ID прав']}
          data={this.props.server.databaseData}
        ></Table>
      </div>
    );
  }
}
