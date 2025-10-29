import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: null;
  token?: string;
}

const initialState: AuthState = {
  user: null,
  token: undefined,
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
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
