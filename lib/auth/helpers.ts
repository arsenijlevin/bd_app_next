import * as cookie from 'cookie';
import { decode } from 'jsonwebtoken';
import { NextPageContext } from 'next';
import Router from 'next/router';

export const enum Rights {
  USER = 1,
  ADMIN = 2,
  ACCOUNTANT = 3,
  DOCTOR = 4
}

export interface ILoginData {
  login: string;
  password: string;
}

export const loginUser = async (loginData: ILoginData) => {
  try {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/auth/login`,
      options
    );
    if (!response.ok) {
      return Promise.reject('Unexpected error happened');
    }
    const json = await response.json();

    if (json) return json;
    return {};
  } catch (error) {
    return {};
  }
};

export const getInitialProps = async (
  ctx: NextPageContext,
  rights: Rights[]
) => {
  if (!ctx.req?.headers.cookie) return;

  const parsedCookies = cookie.parse(ctx.req?.headers.cookie);

  const decodedCookie = decode(parsedCookies.auth) as {
    login: string;
    password: string;
    rights_id: number;
  };

  if (!rights.includes(decodedCookie.rights_id) && !ctx.req) {
    Router.replace('/404');
    return {};
  }

  if (!rights.includes(decodedCookie.rights_id) && ctx.req) {
    ctx.res?.writeHead(302, {
      Location: `${process.env.NEXT_PUBLIC_BASE_URL}/login`
    });
    ctx.res?.end();
    return {};
  }

  return {};
};
