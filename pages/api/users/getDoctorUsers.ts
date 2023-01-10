import type { NextApiRequest, NextApiResponse } from 'next';
import { getDoctorUsers } from '../../../prisma/controllers/usersController';

export default function getUsers(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  return getDoctorUsers(req, res)
    .catch(() => {
      res.status(500).json({ message: 'Unexpected error happened' });
    })
    .finally(() => res.end());
}
