import type { NextApiRequest, NextApiResponse } from 'next';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const reqData = JSON.parse(req.body);

  // TODO: Find id for doctor/patient/service
  // TODO: Setup serviceData

  // TODO: const serviceData = {
  //   TODO: date_time: reqData.dateAndTime,
  //   TODO: doctor_id: reqData.doctor
  // TODO: };

  const savedService = await prisma.rendered_services.create({
    data: reqData
  });

  res.status(200).json(savedService);
}
