import { DepartmentData } from '../../prisma/controllers/departmentsController';

export const getDepartments = async (): Promise<DepartmentData[]> => {
  const options = {
    method: 'POST'
  };

  return await (
    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/departments/getAll`,
      options
    )
  ).json();
};

export const getDepartment = async (
  departmentId: number
): Promise<DepartmentData | undefined> => {
  if (!departmentId) return undefined;

  return await (
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/departments/get`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: `{
        "departmentId": "${departmentId}"
      }`
    })
  ).json();
};

export const addDepartment = async (formData: DepartmentData) => {
  const data: DepartmentData = formData;

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/departments/add`,
    options
  );
  if (!response.ok) {
    return Promise.reject('Unexpected error happened');
  }
  const json = await response.json();

  if (json) return json;
  return {};
};

export const updateDepartment = async (
  departmentId: number | undefined,
  formData: DepartmentData
) => {
  if (!departmentId) return {} as DepartmentData;

  const data: DepartmentData = formData;

  const options = {
    method: 'PUT',
    body: JSON.stringify(data)
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/departments/modify`,
    options
  );

  if (!response.ok) {
    return Promise.reject('Unexpected error happened');
  }
  const json = await response.json();
  if (json) return json;
  return {};
};

export const deleteDepartment = async (departmentId: number) => {
  const options = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      departmentId: departmentId
    })
  };

  return await (
    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/departments/delete`,
      options
    )
  ).json();
};
