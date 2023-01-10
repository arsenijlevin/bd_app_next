import type { NextApiRequest, NextApiResponse } from 'next';
import { addDepartments } from '../../../prisma/controllers/departmentsController';

export default function add(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  return addDepartments(req, res)
    .catch(() => {
      res.status(500).json({ message: 'Unexpected error happened' });
    })
    .finally(() => res.end());
}
