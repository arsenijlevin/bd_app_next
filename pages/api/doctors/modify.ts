import type { NextApiRequest, NextApiResponse } from 'next';
import { modifyDoctors } from '../../../prisma/controllers/doctorsController';

export default function modify(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  return modifyDoctors(req, res)
    .catch(() => {
      res.status(500).json({ message: 'Unexpected error happened' });
    })
    .finally(() => res.end());
}
