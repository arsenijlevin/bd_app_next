import { createSlice } from '@reduxjs/toolkit';

export type InitialState = {
  client: {
    toggleForm?: boolean;
    userLogin?: string | undefined;
    deleteId?: string | null;
  };
};

const initialState: InitialState = {
  client: { toggleForm: false, userLogin: undefined, deleteId: null }
};

export const ReducerSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleChangeAction: state => {
      state.client.toggleForm = !state.client.toggleForm;
    },
    updateAction: (state, action) => {
      state.client.userLogin = action.payload;
    },
    deleteAction: (state, action) => {
      state.client.deleteId = action.payload;
    }
  }
});

export const { toggleChangeAction, updateAction, deleteAction } =
  ReducerSlice.actions;

export default ReducerSlice.reducer;
