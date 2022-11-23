import { UserData } from '../prisma/controller';

export const getUsers = async () => {
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
  return {};
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

export const addUser = async (formData: UserData) => {
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

  return json;
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
  return json;
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
