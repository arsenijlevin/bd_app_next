import { rendered_services } from '@prisma/client';
import { DateTime } from 'luxon';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../db';

export async function addRenderedServices(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const requestData: Omit<rendered_services, 'date_time'> & {
      date_time: string;
    } = req.body;

    if (!requestData) {
      return res.status(404).json({ error: 'Data is not provided' });
    }
    const rendered_service = await prisma.rendered_services.create({
      data: {
        date_time: DateTime.fromFormat(
          requestData.date_time,
          'yyyy-MM-dd HH:mm:ss'
        ).toJSDate(),
        service_id: requestData.service_id,
        patient_id: requestData.patient_id,
        doctor_id: requestData.doctor_id,
        result: requestData.result
      }
    });

    return res.status(200).json({ rendered_service: rendered_service });
  } catch (error) {
    throw new Error('500');
  }
}
