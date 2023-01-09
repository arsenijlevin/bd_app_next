import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../db';

export async function getDepartments(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const departments = await prisma.departments.findMany();

    if (!departments) return res.status(404).json({ error: 'Not found' });

    return res.status(200).json(departments);
  } catch (error) {
    throw new Error('500');
  }
}
