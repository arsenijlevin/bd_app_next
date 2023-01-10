import { NextPageContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Logout from '../../components/auth/Logout';
import { getInitialProps, Rights } from '../../lib/auth/helpers';

Accountant.getInitialProps = (ctx: NextPageContext) =>
  getInitialProps(ctx, [Rights.ADMIN, Rights.ACCOUNTANT]);

export default function Accountant() {
  return (
    <section className="py-5 px-10 container mx-auto">
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
            <Link href="accountant/departments">По отделениям</Link>
          </li>
          <li>
            <Link href="accountant/doctors">По врачам</Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
