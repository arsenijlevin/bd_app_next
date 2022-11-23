import { UserData } from '../prisma/controller';

interface IQueryOptions {
  refetchOnMount: boolean;
  refetchOnWindowFocus: boolean;
}

function parseIntIfValueIsString(value: string | number) {
  return typeof value === 'string' ? parseInt(value) : value;
}

export const useQueryOptions: IQueryOptions = {
  refetchOnMount: false,
  refetchOnWindowFocus: false
};

export const getUsers = async (): Promise<UserData[]> => {
  const options = {
    method: 'POST'
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/users/getAll`,
    options
  );
  if (!response.ok) {
    throw new Error('Error while fetching data!');
  }
  const json = await response.json();

  if (json) return json;
  return [];
};

export const getUser = async (userLogin: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/users/get`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: `{
        "userLogin": "${userLogin}"
      }`
    }
  );
  if (!response.ok) {
    throw new Error('Error while fetching data!');
  }
  const json = await response.json();

  if (json) return json;
  return {};
};

export const addUser = async (
  formData: Omit<UserData, 'rights_id'> & { rights_id: string | number }
) => {
  formData.rights_id = parseIntIfValueIsString(formData.rights_id);

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/users/add`,
    options
  );
  if (!response.ok) {
    throw new Error('Error while fetching data!');
  }
  const json = await response.json();

  if (json) return json;
  return {};
};

export const updateUser = async (userLogin: string, formData: UserData) => {
  const data = {
    userLogin: userLogin,
    login: formData.login,
    password: formData.password,
    name: formData.name,
    rights_id: formData.rights_id
  };

  const options = {
    method: 'PUT',
    body: JSON.stringify(data)
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/users/modify`,
    options
  );

  if (!response.ok) {
    throw new Error('Error while fetching data!');
  }
  const json = await response.json();
  if (json) return json;
  return {};
};

export const deleteUser = async (userLogin: string) => {
  const options = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userLogin: `${userLogin}`
    })
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/users/delete`,
    options
  );
  if (!response.ok) {
    throw new Error('Error while fetching data!');
  }
  const json = await response.json();
  return json;
};
