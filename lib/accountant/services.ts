import { renderedServicesJoined } from '../../prisma/controllers/accountantController';

export const getServicesByDate = async (
  date: string
): Promise<renderedServicesJoined[]> => {
  if (!date) return [];

  console.log('date', date);

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
