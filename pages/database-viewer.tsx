import { GetServerSideProps } from 'next';
import React, { Component } from 'react';

import { prisma } from '../prisma/db';

import { BiUserPlus } from 'react-icons/bi';
import Table from '../components/Table';
import Form from '../components/Form';

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

        <div className="container mx-auto flex justify-between py-5 border-b">
          <div className="left flex gap-3">
            <button className="flex bg-indigo-500 text-white px-4 py-2 border rounded-md hover:bg-indigo-300 hover:text-gray-800">
              Добавить
              <span className="px-1">
                <BiUserPlus size={23}></BiUserPlus>
              </span>
            </button>
          </div>
        </div>

        <div className="container mx-auto py-5">
          <Form></Form>
        </div>

        <div className="container mx-auto">
          <Table></Table>
        </div>
      </section>
    );
  }
}
