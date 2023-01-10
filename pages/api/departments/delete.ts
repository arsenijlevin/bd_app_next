import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteDepartments } from '../../../prisma/controllers/departmentsController';

export default function deleteData(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  return deleteDepartments(req, res)
    .catch(() => {
      res.status(500).json({ message: 'Unexpected error happened' });
    })
    .finally(() => res.end());
}
