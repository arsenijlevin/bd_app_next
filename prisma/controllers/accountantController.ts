import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../db';
import { Prisma } from '@prisma/client';

import { DateTime } from 'luxon';

const renderedServicesInclude =
  Prisma.validator<Prisma.rendered_servicesInclude>()({
    doctors: true,
    patients: true,
    services: true
  });

export type renderedServicesJoined = Prisma.rendered_servicesGetPayload<{
  include: typeof renderedServicesInclude;
}>;

export async function getServicesByDateHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { date } = req.body;

    const gte = DateTime.fromFormat(date, 'yyyy-MM')
      .startOf('month')
      .plus({ hours: 3 })
      .toJSDate();
    const lte = DateTime.fromFormat(date, 'yyyy-MM')
      .endOf('month')
      .plus({ hours: 3 })
      .toJSDate();

    const services = await prisma.rendered_services.findMany({
      where: {
        date_time: {
          lte: lte,
          gte: gte
        }
      },
      include: {
        doctors: true,
        patients: true,
        services: true
      }
    });

    if (!services) return res.status(404).json({ error: 'Not found' });

    return res.status(200).json(services);
  } catch (error) {
    throw new Error('500');
  }
}

export async function getServicesByDateAndDepartmentsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { date, departmentIds } = req.body as {
      date: string;
      departmentIds: number[];
    };
    const gte = DateTime.fromFormat(date, 'yyyy-MM')
      .startOf('month')
      .plus({ hours: 3 })
      .toJSDate();

    const lte = DateTime.fromFormat(date, 'yyyy-MM')
      .endOf('month')
      .plus({ hours: 3 })
      .toJSDate();

    const services = await prisma.rendered_services.findMany({
      where: {
        date_time: {
          lte: lte,
          gte: gte
        },
        doctors: {
          department_id: { in: departmentIds }
        }
      },
      include: {
        doctors: true,
        patients: true,
        services: true
      },
      orderBy: {
        date_time: 'asc'
      }
    });

    if (!services) return res.status(404).json({ error: 'Not found' });

    return res.status(200).json(services);
  } catch (error) {
    throw new Error('500');
  }
}

export async function getServicesByDateAndDoctorsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { date, doctorIds } = req.body;

    const gte = DateTime.fromFormat(date, 'yyyy-MM')
      .startOf('month')
      .plus({ hours: 3 })
      .toJSDate();
    const lte = DateTime.fromFormat(date, 'yyyy-MM')
      .endOf('month')
      .plus({ hours: 3 })
      .toJSDate();

    const services = await prisma.rendered_services.findMany({
      where: {
        date_time: {
          lte: lte,
          gte: gte
        },
        doctors: {
          id: { in: doctorIds }
        }
      },
      include: {
        doctors: true,
        patients: true,
        services: true
      },
      orderBy: {
        date_time: 'asc'
      }
    });

    if (!services) return res.status(404).json({ error: 'Not found' });

    return res.status(200).json(services);
  } catch (error) {
    throw new Error('500');
  }
}
