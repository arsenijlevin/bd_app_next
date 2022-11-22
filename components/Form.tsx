import AddDataForm, { UserFormData } from './AddDataForm';
import { useSelector } from 'react-redux';
import { ChangeEvent, useReducer } from 'react';
import { InitialState } from '../redux/reducer';
import UpdateDataForm from './UpdateDataForm';

const formReducer = (
  state: UserFormData,
  event: ChangeEvent<HTMLInputElement>
) => {
  return {
    ...state,
    [event.target.name]: event.target.value
  };
};

export default function Form() {
  const [formData, setFormData] = useReducer(formReducer, {
    login: '',
    password: '',
    name: '',
    rights_id: ''
  });
  const userLogin = useSelector(
    (state: { app: InitialState }) => state.app.client.userLogin
  );

  console.log(userLogin);

  return (
    <div className="container mx-auto py-5">
      {userLogin
        ? UpdateDataForm({ userLogin, formData, setFormData })
        : AddDataForm({ formData, setFormData })}
    </div>
  );
}
