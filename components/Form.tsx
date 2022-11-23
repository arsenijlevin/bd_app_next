import AddDataForm from './AddDataForm';

import { ChangeEvent, useContext, useReducer } from 'react';

import UpdateDataForm from './UpdateDataForm';
import { ICRUDFunctions } from '../prisma/controller';
import { KeyContext } from '../pages/database-viewer/users';

interface IFormProps<T> {
  CRUDFunctions: ICRUDFunctions<T>;
}

function formReducer<T>(state: T, event: ChangeEvent<HTMLInputElement>) {
  return {
    ...state,
    [event.target.name]: event.target.value
  };
}

export default function Form<T>({ CRUDFunctions }: IFormProps<T>) {
  const [formData, setFormData] = useReducer(formReducer, {});
  const { formMode } = useContext(KeyContext);
  console.log(formMode);

  return (
    <div className="container mx-auto py-5">
      {formMode === 'update'
        ? UpdateDataForm({
            setData: setFormData,
            formData: formData,
            CRUDFunctions: CRUDFunctions
          })
        : AddDataForm({
            formData: formData as T,
            setData: setFormData,
            CRUDFunctions: CRUDFunctions
          })}
    </div>
  );
}
