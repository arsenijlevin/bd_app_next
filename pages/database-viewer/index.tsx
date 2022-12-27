import { NextPageContext } from 'next';
import Head from 'next/head';
import { getInitialProps, Rights } from '../../lib/auth/helpers';

DatabaseViewer.getInitialProps = (ctx: NextPageContext) =>
  getInitialProps(ctx, [Rights.ADMIN]);

function DatabaseViewer() {
  return (
    <section className="py-5">
      <Head>
        <title>Админ-панель</title>
      </Head>
      <h2 className="text-xl md:text-5xl text-center font-bold py-10">
        Админ-панель
      </h2>

      <div className="container mx-auto flex justify-between py-5 border-b">
        <h3>Выберите таблицу: </h3>
      </div>
      <div className="container mx-auto flex justify-between py-5">
        <ul>
          <li>
            <a href="database-viewer/doctors">Врачи</a>
          </li>
          <li>
            <a href="database-viewer/users">Пользователи</a>
          </li>
          <li>
            <a href="database-viewer/services">Услуги</a>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default DatabaseViewer;
