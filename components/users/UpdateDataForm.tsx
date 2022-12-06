import { ChangeEvent, FormEvent, useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { getUsers, updateUser } from '../../lib/users/helpers';
import { KeyContext } from '../../pages/database-viewer/users';

import { UserData } from '../../prisma/controllers/usersController';
import Error from '../utility/Error';
import Loading from '../utility/Loading';
import Success from '../utility/Success';

interface IUpdateForm {
  userToUpdate: UserData | undefined;
}

export default function UpdateDataForm({ userToUpdate }: IUpdateForm) {
  const { formData, setFormData, setFormMode } = useContext(KeyContext);

  const queryClient = useQueryClient();

  const updateMutation = useMutation(
    (newData: UserData) => updateUser(userToUpdate?.login, newData),
    {
      onSuccess: async () => {
        queryClient.prefetchQuery('users', getUsers);
      },
      onError: async () => {
        updateMutation.isError = true;
      }
    }
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (Object.values(formData).every(value => !value))
      return <div>Необходимо заполнить форму</div>;

    const model = Object.assign({}, userToUpdate, formData);

    updateMutation.mutate(model);

    setTimeout(() => {
      updateMutation.reset();
      setFormData && setFormData({} as UserData);
      setFormMode && setFormMode('add');
    }, 2000);
  };

  if (updateMutation.isLoading || !userToUpdate) return <Loading></Loading>;
  if (updateMutation.isError)
    return <Error message="Ошибка при выполнении запроса"></Error>;

  if (updateMutation.isSuccess) return <Success message="Успешно!"></Success>;

  const { login, password, name, rights_id } = userToUpdate;

  return (
    <div key={userToUpdate.login}>
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
            defaultValue={login}
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
            defaultValue={password}
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
            defaultValue={name}
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
            defaultValue={rights_id}
            name="rights_id"
            placeholder="Права"
            className="border w-full px-5 py-3 focus:outline-none rounded-md"
          />
        </div>

        <button className="flex justify-center text-md w-1/3 bg-yellow-500 text-white px-4 py-2 border rounded-md hover:bg-gray-50 hover:border-yellow-50 hover:text-yellow-500">
          Обновить
        </button>
      </form>
      <h4 className="mb-3 mt-2">
        Редактируется: <span className="font-bold">{login}</span>
      </h4>
    </div>
  );
}
