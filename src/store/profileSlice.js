import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import Axios from 'axios';
import {BASE_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';


// console.log(BASE_URL)


export const getTeacherProfile = createAsyncThunk(
    'teacher/teacherProfile',
    async (_, thunkAPI)=>{
        // console.log(`${BASE_URL}/profile/teacher/`);
        try{
            const token = await AsyncStorage.getItem('token');
            if(!token){
                console.log('No Token Found');
                return thunkAPI.rejectWithValue('No Authentication');
            }
            console.log('Token',token)
            const response = await Axios.get(`${BASE_URL}/profile/teacher/`,{
                headers:{
                    Authorization: `Token ${token}`,
                },
            });
            // console.log('getTeacherProfileData',response)
            return response.data;
        }catch(err){
            if(err.response){
                console.log('Error Status:', err.response.status);
                console.log('Error Headers:', err.response.headers)
                console.log('Error Data:', err.response.data);
            }else if(err.request){
                console.log('request error',err.request);
            }
            console.log('Failed to load...')
           return thunkAPI.rejectWithValue(err.response.data.message || 'failed To fecth Profile');
        }
    }

);

export const updateTeacherProfile = createAsyncThunk(
    'teacher/updateProfile',
    async(updatedData,thunkAPI)=>{
        try{
            const token = await AsyncStorage.getItem('token');
            if (!token) {
              return thunkAPI.rejectWithValue('No Authentication');
            }
            const formData = new FormData();
            formData.append('name', updatedData.name);
            formData.append('address', updatedData.address);
            formData.append('contact_number', updatedData.contact_number);
            formData.append('username', updatedData.username);

            if (updatedData.profile_picture) {
                const uri = updatedData.profile_picture;
                const fileName = uri.split('/').pop();
                const fileType = fileName?.split('.').pop();

                formData.append('profile_picture', {
                  uri,
                  name: fileName || 'profile.jpg',
                  type: `image/${fileType || 'jpeg'}`,
                });
              }
              const response = await Axios.put(`${BASE_URL}/profile/user/`, formData, {
                headers: {
                  Authorization: `Token ${token}`,
                  'Content-Type': 'multipart/form-data',
                },
              });
            console.log('response',response);
            return response.data;
        }catch(err){
            console.log('Full error response:', err?.response?.data || err.message);
            return thunkAPI.rejectWithValue('Faild to Update Profile');
        }
    }
);


const teacherProfileSlice = createSlice({
    name:'teacher',
    initialState:{
        profile:null,
        loading:false,
        error:null,
        updateStatus: null,
    },
    reducers:{
        clearTeacherProfile: state=>{
            state.profile = null;
            state.loading =  false;
            state.error = null;
            state.updateStatus = null;
        },
    },
    extraReducers:builder=>{
        builder

        // For Get Teacher Profile
            .addCase(getTeacherProfile.pending,state=>{
                state.loading  = true;
                state.error = null;
            })
            .addCase(getTeacherProfile.fulfilled,(state,action)=>{
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(getTeacherProfile.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.payload;
            })


        // For Update Profile
            .addCase(updateTeacherProfile.pending,state =>{
                state.loading = true;
                state.updateStatus = 'pending';
            })
            .addCase(updateTeacherProfile.fulfilled,(state,action)=>{
                state.loading = false;
                state.updateStatus = 'success';
                state.profile = action.payload;
            })
            .addCase(updateTeacherProfile.rejected,(state,action)=>{
                state.loading = false;
                state.updateStatus = 'failed';
                state.profile = action.payload;
            });
    },
});

export const {clearTeacherProfile} = teacherProfileSlice.actions;
export default teacherProfileSlice.reducer;
