import axios from "axios";

const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");

const initialState = {
    isAuthenticated: false,
    isLoading: false,
    user: null,
    error: null
}

export const registerUser = createAsyncThunk('/api/user', async (formData) => {
    const response = await axios.post(`http://scholarlyapi.glitzit.com/api/user`, formData, {
        withCredentials: true
    });
    return response.data;
})

export const loginUser = createAsyncThunk('/account/login', async (formData) => {
    const response = await axios.post(`http://scholarlyapi.glitzit.com/api/account/login`, formData, {
        withCredentials: true
    })
    return response.data;
})



const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.isLoading = true;
        }).addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        }).addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.error= action.payload || 'Registration failed';
        }).addCase(loginUser.pending, (state) => {
            state.isLoading = true
        }).addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null
        }).addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.error = action.payload || 'Login failed'
        })
    }
})

export default authSlice.reducer;