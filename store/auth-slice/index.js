import axios from "axios";
const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");

const initialState = {
    isAuthenticated: false,
    isLoading: false,
    user: null,
    error: null
}

export const registerUser = createAsyncThunk('/api/user', async (formData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`/api/user`, formData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data?.Warning || "Registration failed");
        }
        return rejectWithValue("Network error. Please try again.");
    }
})

export const loginUser = createAsyncThunk('/account/login', async (formData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`/api/account/login`, formData, {
            withCredentials: true
        })
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
})


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.isLoading = null;
            state.error = null;
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
            state.error = action.payload || 'Registration failed';
        }).addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.isAuthenticated = false;
            state.user = null;
            state.error = null
        }).addCase(loginUser.fulfilled, (state, action) => {
            if (action.payload?.token) {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            } else {
                state.isAuthenticated = false;
                state.isLoading = false;
                state.user = null;
                state.error = action.payload || 'Login failed'
            }
        })
    }
})

export const { logout } = authSlice.actions;
export default authSlice.reducer;