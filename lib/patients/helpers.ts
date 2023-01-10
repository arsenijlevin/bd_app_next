import {
  PatientData,
  PatientsJoined
} from '../../prisma/controllers/patientsController';

export const getPatients = async (): Promise<PatientsJoined[]> => {
  const options = {
    method: 'POST'
  };

  return await (
    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/patients/getAll`,
      options
    )
  ).json();
};

export const getPatient = async (
  patientId: string
): Promise<PatientsJoined | undefined> => {
  if (!patientId) return undefined;

  return await (
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/patients/get`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: `{
        "patientId": "${patientId}"
      }`
    })
  ).json();
};

export const addPatient = async (formData: PatientData) => {
  console.log(formData);

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/patients/add`,
    options
  );
  if (!response.ok) {
    return Promise.reject('Unexpected error happened');
  }
  const json = await response.json();

  if (json) return json;
  return {};
};

export const deletePatient = async (patientId: number) => {
  const options = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      patientId: patientId
    })
  };

  return await (
    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/patients/delete`,
      options
    )
  ).json();
};
