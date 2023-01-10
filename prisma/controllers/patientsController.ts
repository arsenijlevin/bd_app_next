import { NextApiRequest, NextApiResponse } from 'next';
import { IPatientData } from '../interfaces';
import { prisma } from '../db';
import { DateTime } from 'luxon';

export type PatientData = IPatientData;

export type PatientsJoined = PatientData;

export async function getPatients(req: NextApiRequest, res: NextApiResponse) {
  try {
    const patients = await prisma.patients.findMany();

    if (!patients) return res.status(404).json({ error: 'Not found' });

    return res.status(200).json(patients);
  } catch (error) {
    throw new Error('500');
  }
}

export async function addPatients(req: NextApiRequest, res: NextApiResponse) {
  try {
    const formData: PatientData = req.body;
    console.log('formData', formData);

    if (!formData) {
      return res.status(404).json({ error: 'Data is not provided' });
    }

    formData.birthday = DateTime.fromJSDate(
      new Date(formData.birthday)
    ).toJSDate();

    const patient = await prisma.patients.create({
      data: formData
    });

    return res.status(200).json({ patient: patient });
  } catch (error) {
    throw new Error('500');
  }
}

export async function modifyPatients(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const formData = JSON.parse(req.body);
    const patientId: number = formData.patientId;

    if (!patientId || !formData) {
      return res.status(404).json({ error: 'Data is not provided' });
    }

    const patient = await prisma.patients.findFirst({
      where: {
        id: patientId
      }
    });

    await prisma.patients.update({
      where: {
        id: patientId
      },
      data: formData
    });

    return res.status(200).json({ patient: patient });
  } catch (error) {
    throw new Error('500');
  }
}

export async function deletePatients(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { patientId } = req.body;

    console.log('patientId', patientId);

    if (!patientId) {
      return res.status(404).json({ error: 'Data is not provided' });
    }

    const patient = await prisma.patients.delete({
      where: {
        id: patientId
      }
    });

    return res.status(200).json({ deletedPatient: patient });
  } catch (error) {
    throw new Error('500');
  }
}

export async function getPatient(req: NextApiRequest, res: NextApiResponse) {
  try {
    const patientId = req.body.patientId;

    if (!patientId) {
      return res.status(404).json({ error: 'Data is not provided' });
    }

    const patients = await prisma.patients.findFirst({
      where: {
        id: patientId
      }
    });

    return res.status(200).json(patients);
  } catch (error) {
    throw new Error('500');
  }
}
