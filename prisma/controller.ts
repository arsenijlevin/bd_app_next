import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from './db';

export type UserData = {
  login: string;
  password: string;
  name: string;
  rights_id: number;
};

export async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await prisma.users.findMany();

    if (!users) return res.status(404).json({ error: 'Not found' });

    return res.status(200).json(users);
  } catch (error) {
    throw new Error('500');
  }
}

export async function addUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    const formData: UserData = req.body;

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

    const user = await prisma.users.update({
      where: {
        login: userLogin
      },
      data: {
        login: formData.login,
        password: formData.password,
        name: formData.name,
        rights_id: formData.rights_id
      }
    });

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
      }
    });

    return res.status(200).json(users);
  } catch (error) {
    throw new Error('500');
  }
}
