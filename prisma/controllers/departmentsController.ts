import { NextApiRequest, NextApiResponse } from 'next';
import { IDepartmentData } from '../interfaces';
import { prisma } from '../db';
import { parseIntIfValueIsString } from '../../lib/parseIntIfValueIsString';

export type DepartmentData = IDepartmentData;

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

export async function addDepartments(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const formData: DepartmentData = req.body;

    formData.floor = parseInt(formData.floor.toString());

    if (!formData) {
      return res.status(404).json({ error: 'Data is not provided' });
    }

    const department = await prisma.departments.create({
      data: formData
    });

    return res.status(200).json({ department: department });
  } catch (error) {
    throw new Error('500');
  }
}

export async function modifyDepartments(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const formData = JSON.parse(req.body);
    const departmentId: number = formData.id;

    if (!departmentId || !formData) {
      return res.status(404).json({ error: 'Data is not provided' });
    }

    const department = await prisma.departments.update({
      where: {
        id: departmentId
      },
      data: formData
    });

    return res.status(200).json({ department: department });
  } catch (error) {
    throw new Error('500');
  }
}

export async function deleteDepartments(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { departmentId } = req.body;

    if (!departmentId) {
      return res.status(404).json({ error: 'Data is not provided' });
    }

    const department = await prisma.departments.delete({
      where: {
        id: parseIntIfValueIsString(departmentId)
      }
    });

    return res.status(200).json({ deletedDepartment: department });
  } catch (error) {
    throw new Error('500');
  }
}

export async function getDepartment(req: NextApiRequest, res: NextApiResponse) {
  try {
    const departmentId = req.body.departmentId;

    if (!departmentId) {
      return res.status(404).json({ error: 'Data is not provided' });
    }

    const departments = await prisma.departments.findFirst({
      where: {
        id: parseIntIfValueIsString(departmentId)
      }
    });

    return res.status(200).json(departments);
  } catch (error) {
    throw new Error('500');
  }
}
