import AddDataForm from './AddDataForm';

import { ChangeEvent, useContext, useReducer } from 'react';

import UpdateDataForm, { IInputData } from './UpdateDataForm';
import { ICRUDFunctions } from '../prisma/controller';
import { KeyContext } from '../pages/database-viewer/users';

interface IFormProps<T> {
  dataKey: string;
  inputData: IInputData[];
  CRUDFunctions: ICRUDFunctions<T>;
}

function formReducer<T>(state: T, event: ChangeEvent<HTMLInputElement>) {
  return {
    ...state,
    [event.target.name]: event.target.value
  };
}

export default function Form<T>({
  dataKey,
  inputData,
  CRUDFunctions
}: IFormProps<T>) {
  const [formData, setFormData] = useReducer(
    formReducer,
    {} as { [x: string]: string }
  );
  const { key } = useContext(KeyContext);
  return (
    <div className="container mx-auto py-5">
      {key
        ? UpdateDataForm({
            key: key,
            dataKey: dataKey,
            inputData: inputData,
            setData: setFormData,
            formData: formData,
            CRUDFunctions: CRUDFunctions
          })
        : AddDataForm({
            dataKey: dataKey,
            formData: formData,
            inputData: inputData,
            setData: setFormData,
            CRUDFunctions: CRUDFunctions
          })}
    </div>
  );
}
