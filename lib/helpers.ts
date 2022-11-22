import { UserData } from '../prisma/controller';

export const getUsers = async () => {
  const options = {
    method: 'POST'
  };
  const response = await fetch(
    `${process.env.BASE_URL}api/users/getAll`,
    options
  );
  const json = await response.json();

  if (json) return json;
  return {};
};

export const getUser = async (userLogin: string) => {
  console.log(
    JSON.stringify({
      userLogin: `${userLogin}`
    })
  );

  const response = await fetch(`${process.env.BASE_URL}api/users/get`, {
    method: 'POST',
    body: JSON.stringify({
      userLogin: `${userLogin}`
    })
  });
  console.log();

  const json = await response.json();

  if (json) return json;
  return {};
};

export const addUser = async (formData: UserData) => {
  try {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    };

    const response = await fetch(
      `${process.env.BASE_URL}api/users/add`,
      options
    );
    const json = await response.json();

    return json;
  } catch (error) {
    return error;
  }
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
  console.log(JSON.stringify(data));

  const response = await fetch(
    `${process.env.BASE_URL}api/users/modify`,
    options
  );
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
    `${process.env.BASE_URL}api/users/delete`,
    options
  );
  const json = await response.json();
  return json;
};
