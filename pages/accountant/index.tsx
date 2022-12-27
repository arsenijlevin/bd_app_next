import { NextPageContext } from 'next';
import Head from 'next/head';
import Logout from '../../components/auth/Logout';
import { getInitialProps, Rights } from '../../lib/auth/helpers';

Accountant.getInitialProps = (ctx: NextPageContext) =>
  getInitialProps(ctx, [Rights.ADMIN, Rights.ACCOUNTANT]);

export default function Accountant() {
  return (
    <section className="py-5">
      <Head>
        <title>Генерация отчётов</title>
      </Head>
      <h2 className="text-xl md:text-5xl text-center font-bold py-10">
        Генерация отчётов
      </h2>
      <div className="left flex gap-3">
        <Logout></Logout>
      </div>
      <div className="container mx-auto flex justify-between py-5 border-b">
        <h3>Выберите вид отчёта: </h3>
      </div>
      <div className="container mx-auto flex justify-between py-5">
        <ul>
          <li>
            <a href="accountant/departments">По отделениям</a>
          </li>
          <li>
            <a href="accountant/doctors">По врачам</a>
          </li>
        </ul>
      </div>
    </section>
  );
}
