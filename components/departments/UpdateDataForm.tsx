import { ChangeEvent, FormEvent, useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import {
  getDepartments,
  updateDepartment
} from '../../lib/departments/helpers';
import { KeyDepartmentsContext } from '../../pages/database-viewer/departments';

import { DepartmentData } from '../../prisma/controllers/departmentsController';
import Error from '../utility/Error';
import Loading from '../utility/Loading';
import Success from '../utility/Success';

interface IUpdateForm {
  departmentToUpdate: DepartmentData | undefined;
}

export default function UpdateDataForm({ departmentToUpdate }: IUpdateForm) {
  const { formData, setFormData, setFormMode } = useContext(
    KeyDepartmentsContext
  );

  const queryClient = useQueryClient();

  const updateMutation = useMutation(
    (newData: DepartmentData) =>
      updateDepartment(departmentToUpdate?.id, newData),
    {
      onSuccess: async () => {
        queryClient.prefetchQuery('departments', getDepartments);
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

    const model = Object.assign({}, departmentToUpdate, formData);

    updateMutation.mutate(model);

    setTimeout(() => {
      updateMutation.reset();
      setFormData && setFormData({} as DepartmentData);
      setFormMode && setFormMode('add');
    }, 2000);
  };

  if (updateMutation.isLoading || !departmentToUpdate)
    return <Loading></Loading>;
  if (updateMutation.isError)
    return <Error message="Ошибка при выполнении запроса"></Error>;

  if (updateMutation.isSuccess) return <Success message="Успешно!"></Success>;

  const { id, title, floor } = departmentToUpdate;

  return (
    <div key={departmentToUpdate.id}>
      <form className="grid lg:grid-cols-2 w-2/3 gap-4" onSubmit={handleSubmit}>
        <div className="input-type hidden">
          <input
            type="number"
            name="id"
            placeholder="ID"
            className="border w-full px-5 py-3 focus:outline-none rounded-md"
          />
        </div>
        <div className="input-type">
          <input
            type="text"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setFormData &&
                setFormData(
                  Object.assign(formData, { title: event.target.value })
                );
            }}
            defaultValue={title}
            name="title"
            placeholder="Название"
            className="border w-full px-5 py-3 focus:outline-none rounded-md"
          />
        </div>
        <div className="input-type">
          <input
            type="number"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setFormData &&
                setFormData(
                  Object.assign(formData, { floor: event.target.value })
                );
            }}
            name="floor"
            defaultValue={floor}
            placeholder="Этаж"
            className="border w-full px-5 py-3 focus:outline-none rounded-md"
          />
        </div>

        <button className="flex justify-center text-md w-1/3 bg-yellow-500 text-white px-4 py-2 border rounded-md hover:bg-gray-50 hover:border-yellow-50 hover:text-yellow-500">
          Обновить
        </button>
      </form>
      <h4 className="mb-3 mt-2">
        Редактируется: <span className="font-bold">{`(${id}) ${title}`}</span>
      </h4>
    </div>
  );
}
