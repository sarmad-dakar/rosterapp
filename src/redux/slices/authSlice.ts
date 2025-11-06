import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: null;
  token?: string;
  employees: [];
}

const initialState: AuthState = {
  user: null,
  token: undefined,
  employees: [],
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload;
      state.token = action.payload?.token;
    },
    logout: state => {
      state.user = null;
      state.token = undefined;
      state.employees = [];
    },
    updateEmployees: (state, action) => {
      state.employees = action.payload;
    },
  },
});

export const { login, logout, updateEmployees } = authSlice.actions;
export default authSlice.reducer;
