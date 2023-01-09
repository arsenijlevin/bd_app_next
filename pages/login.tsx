import Head from 'next/head';
import { FormEvent, useRef, useState } from 'react';
import Error from '../components/utility/Error';
import {
  getInitialLoginProps,
  getUserHomePageByRights,
  ILoginData,
  loginUser,
  Rights
} from '../lib/auth/helpers';
import { useRouter } from 'next/router';
import Success from '../components/utility/Success';
import { NextPageContext } from 'next';

Login.getInitialProps = (ctx: NextPageContext) => getInitialLoginProps(ctx);

export default function Login() {
  const router = useRouter();
  const loginRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

      if (response.status === 'OK') {
        const rights: Rights = response.rights_id;

        const homePage = getUserHomePageByRights(rights);

        setIsSuccess(true);

        setTimeout(() => {
          setIsSuccess(false);
          router.push(`/${homePage}`);
        }, 1500);
      }
    } catch (error) {
      console.log(error);

      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 3500);
    }
  };

  return (
    <section className="py-5 container mx-auto">
      <Head>
        <title>Вход</title>
      </Head>
      <h2 className="text-xl md:text-5xl text-center font-bold py-10">Вход</h2>

      {isError && <Error message="Неправильный логин или пароль!"></Error>}
      {isSuccess && <Success message="Вы успешно вошли в систему!"></Success>}

      <div className="container mx-auto flex justify-between py-5 border-b">
        <h3>Для продолжения войдите в свою учётную запись:</h3>
      </div>
      <div className="container mx-auto flex justify-between py-5">
        <form onSubmit={onSubmit}>
          <div className="container flex justify-between py-5 flex-col gap-2 w-96">
            <h3>Логин: </h3>
            <input
              type="text"
              placeholder="Логин"
              ref={loginRef}
              className="border w-full px-5 py-3 focus:outline-none rounded-md"
            />
          </div>
          <div className="container flex justify-between py-5 flex-col gap-2 w-96">
            <h3>Пароль: </h3>
            <input
              type="password"
              placeholder="Пароль"
              ref={passwordRef}
              className="border w-full px-5 py-3 focus:outline-none rounded-md"
            />
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
