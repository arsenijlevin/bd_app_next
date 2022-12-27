import { renderedServicesJoined } from '../../prisma/controllers/accountantController';

export const getServicesByDate = async (
  date: string
): Promise<renderedServicesJoined[]> => {
  if (!date) return [];

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date: date
    })
  };

  return await (
    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/accountant/getServicesByDate`,
      options
    )
  ).json();
};

export const getServicesByDateAndDepartment = async (
  date: string,
  departmentId: number
): Promise<renderedServicesJoined[]> => {
  console.log('date', date);
  console.log('DI', departmentId);

  if (!date || !departmentId) return [];

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date: date,
      departmentId: departmentId
    })
  };

  return await (
    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/accountant/getServicesByDateAndDepartment`,
      options
    )
  ).json();
};

export const getServicesByDateAndDoctor = async (
  date: string,
  doctorId: number
): Promise<renderedServicesJoined[]> => {
  console.log('date', date);
  console.log('DI', doctorId);

  if (!date || !doctorId) return [];

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date: date,
      doctorId: doctorId
    })
  };

  return await (
    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/accountant/getServicesByDateAndDoctor`,
      options
    )
  ).json();
};
