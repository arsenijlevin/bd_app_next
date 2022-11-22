import { GetServerSideProps } from 'next';
import React, { Component } from 'react';

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
      <section className="py-5">
        <h2 className="text-xl md:text-5xl text-center font-bold py-10">
          DatabaseViewer
        </h2>
      </section>
    );
  }
}
