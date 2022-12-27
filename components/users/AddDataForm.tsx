import { ChangeEvent, FormEvent, useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { addUser, getUsers } from '../../lib/users/helpers';
import { KeyUsersContext } from '../../pages/database-viewer/users';
import { UserData } from '../../prisma/controllers/usersController';

import Error from '../utility/Error';
import Loading from '../utility/Loading';
import Success from '../utility/Success';

export default function AddDataForm() {
  const { formData, setFormData } = useContext(KeyUsersContext);

  const queryClient = useQueryClient();

  const addMutation = useMutation(addUser, {
    onSuccess: () => {
      queryClient.prefetchQuery('users', getUsers);
    }
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    addMutation.mutate(formData);

    setTimeout(() => {
      addMutation.reset();
      setFormData && setFormData({} as UserData);
    }, 2000);
  };

  if (addMutation.isLoading) return <Loading></Loading>;
  if (addMutation.isError)
    return <Error message="Ошибка при выполнении запроса"></Error>;

  if (addMutation.isSuccess) return <Success message="Успешно!"></Success>;

  return (
    <form className="grid lg:grid-cols-2 w-2/3 gap-4" onSubmit={handleSubmit}>
      <div className="input-type">
        <input
          type="text"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setFormData &&
              setFormData(
                Object.assign(formData, { login: event.target.value })
              );
          }}
          name="login"
          placeholder="Логин"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
        />
      </div>
      <div className="input-type">
        <input
          type="text"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setFormData &&
              setFormData(
                Object.assign(formData, { password: event.target.value })
              );
          }}
          name="password"
          placeholder="Пароль"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
        />
      </div>
      <div className="input-type">
        <input
          type="text"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setFormData &&
              setFormData(
                Object.assign(formData, { name: event.target.value })
              );
          }}
          name="name"
          placeholder="Имя пользователя"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
        />
      </div>
      <div className="input-type">
        <input
          type="number"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setFormData &&
              setFormData(
                Object.assign(formData, { rights_id: event.target.value })
              );
          }}
          name="rights_id"
          placeholder="Права"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
        />
      </div>
      <button
        type="submit"
        className="flex justify-center text-md w-1/3 bg-green-500 text-black px-4 py-2 border rounded-md hover:bg-gray-50 hover:border-green-500 hover:text-green-500"
      >
        Добавить
      </button>
    </form>
  );
}
