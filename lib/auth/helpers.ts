import * as cookie from 'cookie';
import { decode } from 'jsonwebtoken';
import { GetServerSidePropsContext, NextPageContext } from 'next';
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

export const logoutUser = async () => {
  try {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/auth/logout`,
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

export const getInitialLoginProps = async (ctx: NextPageContext) => {
  if (!ctx.req?.headers.cookie) {
    return {};
  }

  const parsedCookies = cookie.parse(ctx.req?.headers.cookie);

  const decodedCookie = decode(parsedCookies.auth) as {
    login: string;
    password: string;
    rights_id: number;
  };

  const homePage = getUserHomePageByRights(decodedCookie.rights_id);

  if (decodedCookie.rights_id && !ctx.req) {
    Router.replace(`/${homePage}`);
    return {};
  }

  if (decodedCookie.rights_id && ctx.req) {
    ctx.res?.writeHead(302, {
      Location: `${process.env.NEXT_PUBLIC_BASE_URL}/${homePage}`
    });
    ctx.res?.end();
    return {};
  }
};

export const getInitialProps = async (
  ctx: NextPageContext | GetServerSidePropsContext,
  rights: Rights[]
) => {
  if (!ctx.req?.headers.cookie) {
    ctx.res?.end();
    return {};
  }

  const parsedCookies = cookie.parse(ctx.req?.headers.cookie);

  const decodedCookie = decode(parsedCookies.auth) as {
    login: string;
    password: string;
    rights_id: number;
  };

  if (!rights.includes(decodedCookie.rights_id) && !ctx.req) {
    Router.replace('/login');
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

export const getInitialIndexProps = async (
  ctx: NextPageContext | GetServerSidePropsContext
) => {
  if (!ctx.req) {
    Router.replace('/login');
    return {};
  }

  if (ctx.req) {
    ctx.res?.writeHead(302, {
      Location: `${process.env.NEXT_PUBLIC_BASE_URL}/login`
    });
    ctx.res?.end();
    return {};
  }

  return {};
};

export const getUserHomePageByRights = (rights: Rights) => {
  switch (rights) {
    case Rights.ADMIN: {
      return 'database-viewer';
    }
    case Rights.ACCOUNTANT: {
      return 'accountant';
    }
    case Rights.DOCTOR: {
      return 'doctor-add-service';
    }
    default: {
      return '';
    }
  }
};
