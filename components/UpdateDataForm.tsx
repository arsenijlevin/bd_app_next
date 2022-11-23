import { ChangeEvent, Dispatch, FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ICRUDFunctions } from '../prisma/controller';

interface IUpdateForm<T> {
  key: string;
  dataKey: string;
  formData: Record<string, string>;
  inputData: IInputData[];
  setData: Dispatch<ChangeEvent<HTMLInputElement>>;
  CRUDFunctions: ICRUDFunctions<T>;
}

export interface IInputData {
  placeholder?: string;
}

export default function UpdateDataForm<T>({
  key,
  dataKey,
  formData,
  inputData,
  setData,
  CRUDFunctions
}: IUpdateForm<T>) {
  const queryClient = useQueryClient();

  const { isLoading, isError, data } = useQuery([dataKey, key], () =>
    CRUDFunctions.get(key as keyof T)
  );
  const updateMutation = useMutation(
    (newData: T) => CRUDFunctions.update(key as keyof T, newData),
    {
      onSuccess: async () => {
        queryClient.prefetchQuery(dataKey, CRUDFunctions.getAll);
        console.log('COMPLETE');
      }
    }
  );

  if (isLoading) return <div>Loading...!</div>;
  if (isError || !data || !formData) return <div>Error</div>;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (Object.values(formData).every(value => !value))
      return <div>Необходимо заполнить форму</div>;

    const model = Object.assign({}, data, formData);

    updateMutation.mutate(model);
  };

  return (
    <div>
      <h4 className="mb-3">
        Редактируется: <span className="font-bold">{key || ''}</span>
      </h4>
      <form className="grid lg:grid-cols-2 w-2/3 gap-4" onSubmit={handleSubmit}>
        {Object.keys(data).map((dataKey: string, index: number) => {
          return (
            <div className="input-type" key={index}>
              <input
                type="text"
                onChange={setData}
                defaultValue={
                  (data as Record<string, string | number>)[dataKey] || ''
                }
                name={dataKey}
                placeholder={inputData[index].placeholder}
                className="border w-full px-5 py-3 focus:outline-none rounded-md"
              />
            </div>
          );
        })}

        <button className="flex justify-center text-md w-1/3 bg-yellow-500 text-white px-4 py-2 border rounded-md hover:bg-gray-50 hover:border-yellow-50 hover:text-yellow-500">
          Обновить
        </button>
      </form>
    </div>
  );
}
