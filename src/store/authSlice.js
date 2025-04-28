import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import {BASE_URL} from '@env';
import {Alert} from 'react-native';

console.log('BASE_URL', BASE_URL);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({username, password}, thunkAPI) => {
    try {
      // console.log(`${BASE_URL}/login/`)
      const response = await Axios.post(`${BASE_URL}/login/`, {
        username,
        password,
      });
      console.log('response', response);
      const data = response.data;
      console.log('Token set data', data);
      await AsyncStorage.setItem('token', data.token);
      return data;
    } catch (err) {
      Alert.alert('Login Failed', 'Invalid Username or password');
      console.log(err);
      return thunkAPI.rejectWithValue(
        err.response.data.message || 'Login failed',
      );
    }
  },
);

// export const forgotPassword = createAsyncThunk(
//   'auth/forgotPassword',
//   async (email, thunkAPI) => {
//     try {
//       const response = await Axios.post(`${BASE_URL}/forgot-password/`, {
//         email,
//       });
//       return response.data;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed');
//     }
//   }
// );

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: false,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginsuccess: (state, action) => {
      state.token = action.payload;
      state.isLoggedIn = true;
    },
    logout: state => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      AsyncStorage.removeItem('token');
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        state.user = action.payload.user || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {loginSuccess, logout} = authSlice.actions;
export default authSlice.reducer;
