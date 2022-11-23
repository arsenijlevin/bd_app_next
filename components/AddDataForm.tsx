import { ChangeEvent, Dispatch, FormEvent } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { addUser, getUsers } from '../lib/helpers';
import Success from './Success';
import Error from './Error';

export type UserFormData = {
  login: string;
  password: string;
  name: string;
  rights_id: string;
};

export default function AddDataForm({
  formData,
  setFormData
}: {
  formData: UserFormData;
  setFormData: Dispatch<ChangeEvent<HTMLInputElement>>;
}) {
  const queryClient = useQueryClient();
  const addMutation = useMutation(addUser, {
    onSuccess: () => {
      queryClient.prefetchQuery('users', getUsers);
    }
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (Object.values(formData).some(value => value.length === 0))
      return console.error('Форма пуста');

    const { login, password, name, rights_id } = formData;

    const model = {
      login: login,
      password: password,
      name: name,
      rights_id: parseInt(rights_id)
    };

    addMutation.mutate(model);
  };

  if (addMutation.isLoading) return <div>Loading!</div>;
  if (addMutation.isError) return <Error message={`Произошла ошибка!`}></Error>;
  if (addMutation.isSuccess) return <Success message={'Успешно!'}></Success>;
  return (
    <form className="grid lg:grid-cols-2 w-2/3 gap-4" onSubmit={handleSubmit}>
      <div className="input-type">
        <input
          type="text"
          onChange={setFormData}
          name="login"
          placeholder="Логин"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
        />
      </div>
      <div className="input-type">
        <input
          type="text"
          onChange={setFormData}
          name="password"
          placeholder="Пароль"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
        />
      </div>
      <div className="input-type">
        <input
          type="text"
          name="name"
          onChange={setFormData}
          placeholder="Имя пользователя"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
        />
      </div>
      <div className="input-type">
        <input
          type="text"
          onChange={setFormData}
          name="rights_id"
          placeholder="Права"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
        />
      </div>

      <button className="flex justify-center text-md w-1/3 bg-green-500 text-white px-4 py-2 border rounded-md hover:bg-gray-50 hover:border-green-500 hover:text-green-500">
        Готово
      </button>
    </form>
  );
}
