import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: null | { role: 'owner' | 'rider'; name: string };
}

const initialState: AuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload;
    },
    logout: state => {
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
