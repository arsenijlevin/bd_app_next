import { NextApiRequest, NextApiResponse } from 'next';
import { IUserData } from '../interfaces';
import { prisma } from '../db';
import * as bcrypt from 'bcrypt';
import { Secret, sign } from 'jsonwebtoken';
import cookie from 'cookie';
import { Rights } from '../../lib/auth/helpers';
import { Prisma } from '@prisma/client';

export type UserData = IUserData;

const usersInclude = Prisma.validator<Prisma.usersInclude>()({
  rights: true
});

export type UsersJoined = Prisma.usersGetPayload<{
  include: typeof usersInclude;
}>;

export async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await prisma.users.findMany({
      include: {
        rights: true
      }
    });

    if (!users) return res.status(404).json({ error: 'Not found' });

    return res.status(200).json(users);
  } catch (error) {
    throw new Error('500');
  }
}

export async function addUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    const formData: UserData = req.body;

    const password = formData.password;

    const hash = await bcrypt.hash(password, 10);

    formData.password = hash;

    if (!formData) {
      return res.status(404).json({ error: 'Data is not provided' });
    }

    const user = await prisma.users.create({
      data: formData
    });

    return res.status(200).json({ user: user });
  } catch (error) {
    throw new Error('500');
  }
}

export async function modifyUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    const formData = JSON.parse(req.body);
    const userLogin: string = formData.userLogin;

    if (!userLogin || !formData) {
      return res.status(404).json({ error: 'Data is not provided' });
    }

    const user = await prisma.users.findFirst({
      where: {
        login: userLogin
      }
    });

    const data = {
      login: formData.login,
      password: formData.password,
      name: formData.name,
      rights_id: formData.rights_id
    };
    console.log(formData.password);
    console.log(user?.password);

    if (formData.password === user?.password) {
      delete data.password;
    } else {
      data.password = await bcrypt.hash(data.password, 10);
    }
    await prisma.users.update({
      where: {
        login: userLogin
      },
      data: data
    });

    console.log(data);

    return res.status(200).json({ user: user });
  } catch (error) {
    throw new Error('500');
  }
}

export async function deleteUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userLogin } = req.body;

    if (!userLogin) {
      return res.status(404).json({ error: 'Data is not provided' });
    }

    const user = await prisma.users.delete({
      where: {
        login: userLogin.toString()
      }
    });

    return res.status(200).json({ deletedUser: user });
  } catch (error) {
    throw new Error('500');
  }
}

export async function getUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userLogin = req.body.userLogin;

    if (!userLogin) {
      return res.status(404).json({ error: 'Data is not provided' });
    }

    const users = await prisma.users.findFirst({
      where: {
        login: userLogin.toString()
      },
      include: {
        rights: true
      }
    });

    return res.status(200).json(users);
  } catch (error) {
    throw new Error('500');
  }
}

export async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    const login = req.body.login;

    const user = await prisma.users.findFirst({
      where: {
        login: login.toString()
      }
    });

    if (!user) throw new Error('500');

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) throw new Error('500');

    const claims = {
      login: user.login,
      username: user.name,
      rights_id: user.rights_id
    };
    const jwt = sign(claims, process.env.SECRET_KEY as Secret, {
      expiresIn: '1h'
    });

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('auth', jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 3600,
        path: '/'
      })
    );

    return res
      .status(200)
      .json({ status: 'OK', rights_id: user.rights_id as Rights });
  } catch (error) {
    return res.status(403).json({ error: 'Something went wrong!' });
  }
}

export async function logout(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.setHeader('Set-Cookie', [
      cookie.serialize('auth', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: -1,
        path: '/'
      })
    ]);

    res.end();
  } catch (error) {
    return res.status(403).json({ error: 'Something went wrong!' });
  }
}
