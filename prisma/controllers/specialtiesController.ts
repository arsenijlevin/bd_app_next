import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../db';

export async function getSpecialties(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const specialties = await prisma.specialties.findMany();

    if (!specialties) return res.status(404).json({ error: 'Not found' });

    return res.status(200).json(specialties);
  } catch (error) {
    throw new Error('500');
  }
}
