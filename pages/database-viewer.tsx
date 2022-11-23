import { BiCheck, BiUserPlus, BiX } from 'react-icons/bi';

import Form from '../components/Form';
import Table from '../components/Table';
import { useSelector, useDispatch } from 'react-redux';
import {
  deleteAction,
  InitialState,
  toggleChangeAction
} from '../redux/reducer';
import { useQueryClient } from 'react-query';
import { deleteUser, getUsers } from '../lib/helpers';

export default function DatabaseViewer() {
  const visible = useSelector(
    (state: { app: InitialState }) => state.app.client.toggleForm
  );
  const deleteId = useSelector(
    (state: { app: InitialState }) => state.app.client.deleteId
  );
  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const deleteHandler = async () => {
    if (deleteId) {
      await deleteUser(deleteId);
      await queryClient.prefetchQuery('users', getUsers);
      dispatch(deleteAction(null));
    }
  };

  const cancleHandler = async () => {
    dispatch(deleteAction(null));
  };
  const addButtonOnClickHandler = () => {
    dispatch(toggleChangeAction());
  };

  return (
    <section className="py-5">
      <h2 className="text-xl md:text-5xl text-center font-bold py-10">
        DatabaseViewer
      </h2>

      <div className="container mx-auto flex justify-between py-5 border-b">
        <div className="left flex gap-3">
          <button
            onClick={addButtonOnClickHandler}
            className="flex bg-indigo-500 text-white px-4 py-2 border rounded-md hover:bg-indigo-300 hover:text-gray-800"
          >
            Добавить
            <span className="px-1">
              <BiUserPlus size={23}></BiUserPlus>
            </span>
          </button>
          {deleteId ? (
            DeleteComponent({ deleteHandler, cancleHandler, deleteId })
          ) : (
            <></>
          )}
        </div>
      </div>

      {visible ? <Form></Form> : <></>}

      <div className="container mx-auto">
        <Table></Table>
      </div>
    </section>
  );
}

function DeleteComponent({
  deleteHandler,
  cancleHandler,
  deleteId
}: {
  deleteHandler: () => void;
  cancleHandler: () => void;
  deleteId: string;
}) {
  return (
    <div className="flex gap-5">
      <button>
        Удалить <span className="font-bold">{deleteId}</span>?
      </button>
      <button
        onClick={deleteHandler}
        className="flex bg-red-500 text-white px-4 py-2 border rounded-md hover:bg-rose-500 hover:border-red-500 hover:text-gray-50"
      >
        Да{' '}
        <span className="px-1">
          <BiX color="rgb(255 255 255)" size={25} />
        </span>
      </button>
      <button
        onClick={cancleHandler}
        className="flex bg-green-500 text-white px-4 py-2 border rounded-md hover:bg-gree-500 hover:border-green-500 hover:text-gray-50"
      >
        Нет{' '}
        <span className="px-1">
          <BiCheck color="rgb(255 255 255)" size={25} />
        </span>
      </button>
    </div>
  );
}
