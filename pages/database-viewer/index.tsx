import { NextPageContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Logout from '../../components/auth/Logout';
import { getInitialProps, Rights } from '../../lib/auth/helpers';

DatabaseViewer.getInitialProps = (ctx: NextPageContext) =>
  getInitialProps(ctx, [Rights.ADMIN]);

function DatabaseViewer() {
  return (
    <section className="py-5 container mx-auto">
      <Head>
        <title>Админ-панель</title>
      </Head>
      <h2 className="text-xl md:text-5xl text-center font-bold py-10">
        Админ-панель
      </h2>
      <div className="left flex gap-3">
        <Logout></Logout>
      </div>
      <div className="container mx-auto flex justify-between py-5 border-b">
        <h3>Выберите таблицу: </h3>
      </div>
      <div className="container mx-auto flex justify-between py-5">
        <ul>
          <li>
            <Link href="database-viewer/doctors">Врачи</Link>
          </li>
          <li>
            <Link href="database-viewer/users">Пользователи</Link>
          </li>
          <li>
            <Link href="database-viewer/services">Услуги</Link>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default DatabaseViewer;
