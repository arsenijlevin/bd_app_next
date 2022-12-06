import type { NextApiRequest, NextApiResponse } from 'next';
import { getDoctors } from '../../../prisma/controllers/doctorsController';

export default function getAll(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  return getDoctors(req, res)
    .catch(() => {
      res.status(500).json({ message: 'Unexpected error happened' });
    })
    .finally(() => res.end());
}
