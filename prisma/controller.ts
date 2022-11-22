import { NextApiRequest, NextApiResponse } from 'next';
import { UserFormData } from '../components/addDataForm';
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

    if (!users) return res.status(404);

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Unexpected error happened!' });
  }
}

export async function addUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    const formData: UserFormData = req.body;

    if (!formData) {
      return res.status(404).json({ error: 'Data is not provided' });
    }

    const userData: UserData = {
      login: formData.login,
      password: formData.password,
      name: formData.name,
      rights_id: parseInt(formData.rights_id)
    };

    const user = await prisma.users.create({
      data: userData
    });

    return res.status(200).json({ user: user });
  } catch (error) {
    return res.status(500).json({ error: 'Unexpected error happened!' });
  }
}

export async function modifyUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userLogin } = req.body;
    const formData = req.body;

    if (!userLogin || !formData) {
      return res.status(404).json({ error: 'Data is not provided' });
    }

    const user = await prisma.users.update({
      where: {
        login: userLogin.toString()
      },
      data: formData
    });

    return res.status(200).json({ user: user });
  } catch (error) {
    return res.status(500).json({ error: 'Unexpected error happened!' });
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
    return res.status(500).json({ error: 'Unexpected error happened!' });
  }
}

export async function getUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userLogin } = req.body;

    if (!userLogin) {
      return res.status(404).json({ error: 'Data is not provided' });
    }

    const users = await prisma.users.findMany({
      where: {
        login: userLogin.toString()
      }
    });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Unexpected error happened!' });
  }
}
