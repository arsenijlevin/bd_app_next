import Head from 'next/head';
import { FormEvent, useRef } from 'react';
import { ILoginData, loginUser } from '../lib/auth/helpers';

export default function Accountant() {
  const loginRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (event: FormEvent) => {
    try {
      event.preventDefault();

      const login = loginRef.current?.value;
      const password = passwordRef.current?.value;

      if (!login || !password) return;

      const loginData: ILoginData = {
        login: login,
        password: password
      };

      const response = await loginUser(loginData);

      console.log(response);
    } catch (error) {
      console.log('Ошибка');
    }
  };

  return (
    <section className="py-5">
      <Head>
        <title>Вход</title>
      </Head>
      <h2 className="text-xl md:text-5xl text-center font-bold py-10">Вход</h2>

      <div className="container mx-auto flex justify-between py-5 border-b">
        <h3>Для продолжения войдите в свою учётную запись:</h3>
      </div>
      <div className="container mx-auto flex justify-between py-5">
        <form onSubmit={onSubmit}>
          <div className="container flex justify-between py-5 flex-col gap-2 w-96">
            <h3>Логин: </h3>
            <input type="text" placeholder="Логин" ref={loginRef} />
          </div>
          <div className="container flex justify-between py-5 flex-col gap-2 w-96">
            <h3>Пароль: </h3>
            <input type="password" placeholder="Пароль" ref={passwordRef} />
          </div>
          <button
            type="submit"
            className="flex justify-center items-center text-md w-1/3 bg-green-500 text-black px-4 py-2 border rounded-md hover:bg-gray-50 hover:border-green-500 hover:text-green-500"
          >
            Войти
          </button>
        </form>
      </div>
    </section>
  );
}
