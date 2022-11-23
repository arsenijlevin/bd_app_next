import { ChangeEvent, Dispatch, FormEvent, useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { KeyContext } from '../pages/database-viewer/users';
import { ICRUDFunctions } from '../prisma/controller';

import Error from './Error';
import Success from './Success';

interface IAddForm<T> {
  setData: Dispatch<ChangeEvent<HTMLInputElement>>;
  CRUDFunctions: ICRUDFunctions<T>;
  formData: T;
}

export default function AddDataForm<T>({
  formData,
  setData,
  CRUDFunctions
}: IAddForm<T>) {
  const { queryKey, inputData, formNames } = useContext(KeyContext);

  const queryClient = useQueryClient();
  const addMutation = useMutation(CRUDFunctions.set, {
    onSuccess: () => {
      queryClient.prefetchQuery(queryKey, CRUDFunctions.getAll);
    }
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    addMutation.mutate(formData as T);
  };

  if (addMutation.isLoading) return <div>Loading!</div>;
  if (addMutation.isError) return <Error message={`Произошла ошибка!`}></Error>;
  if (addMutation.isSuccess) return <Success message={'Успешно!'}></Success>;

  return (
    <form className="grid lg:grid-cols-2 w-2/3 gap-4" onSubmit={handleSubmit}>
      {Object.values(formNames).map((formName: string, index: number) => {
        return (
          <div className="input-type" key={index}>
            <input
              type="text"
              onChange={setData}
              name={formName}
              placeholder={inputData[index].placeholder}
              className="border w-full px-5 py-3 focus:outline-none rounded-md"
            />
          </div>
        );
      })}

      <button className="flex justify-center text-md w-1/3 bg-green-500 text-white px-4 py-2 border rounded-md hover:bg-gray-50 hover:border-green-500 hover:text-green-500">
        Готово
      </button>
    </form>
  );
}
