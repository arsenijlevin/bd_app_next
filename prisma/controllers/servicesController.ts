import { NextApiRequest, NextApiResponse } from 'next';
import { IServiceData } from '../interfaces';
import { prisma } from '../db';
import { parseIntIfValueIsString } from '../../lib/parseIntIfValueIsString';

export type ServiceData = IServiceData;

export async function getServices(req: NextApiRequest, res: NextApiResponse) {
  try {
    const services = await prisma.services.findMany();

    if (!services) return res.status(404).json({ error: 'Not found' });

    return res.status(200).json(services);
  } catch (error) {
    throw new Error('500');
  }
}

export async function addServices(req: NextApiRequest, res: NextApiResponse) {
  try {
    const formData: ServiceData = req.body;

    if (!formData) {
      return res.status(404).json({ error: 'Data is not provided' });
    }

    const service = await prisma.services.create({
      data: formData
    });

    return res.status(200).json({ service: service });
  } catch (error) {
    throw new Error('500');
  }
}

export async function modifyServices(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const formData = JSON.parse(req.body);
    const serviceId: number = formData.id;

    if (!serviceId || !formData) {
      return res.status(404).json({ error: 'Data is not provided' });
    }

    const service = await prisma.services.update({
      where: {
        id: serviceId
      },
      data: formData
    });

    return res.status(200).json({ service: service });
  } catch (error) {
    throw new Error('500');
  }
}

export async function deleteServices(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { serviceId } = req.body;

    if (!serviceId) {
      return res.status(404).json({ error: 'Data is not provided' });
    }

    const service = await prisma.services.delete({
      where: {
        id: parseIntIfValueIsString(serviceId)
      }
    });

    return res.status(200).json({ deletedService: service });
  } catch (error) {
    throw new Error('500');
  }
}

export async function getService(req: NextApiRequest, res: NextApiResponse) {
  try {
    const serviceId = req.body.serviceId;

    if (!serviceId) {
      return res.status(404).json({ error: 'Data is not provided' });
    }

    const services = await prisma.services.findFirst({
      where: {
        id: parseIntIfValueIsString(serviceId)
      }
    });

    return res.status(200).json(services);
  } catch (error) {
    throw new Error('500');
  }
}
