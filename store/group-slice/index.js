import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoading: false,
    groupList: [],
    error: null
}

export const addGroup = createAsyncThunk("/pdf/addgroup", async ({ userId, groupName, tagsText, authToken }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`/api/PDF/addgroup?UserId=${userId}&GroupName=${groupName}&TagsText=${tagsText}`, {}, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "An error occurred");
    }
});

export const getGroupsByUserId = createAsyncThunk("/pdf/getgroups", async ({ userId, authToken }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/api/PDF/loadgroups?UserId=${userId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });
        return response?.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch groups");
    }
});


export const deleteGroup = createAsyncThunk('/pdf/deletegroup', async ({ userId, groupId, authToken }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`/api/PDF/deletegroup?UserId=${userId}&GroupId=${groupId}`, {}, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });
        return response?.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Can not delete group')
    }
})

export const addNewEmail = createAsyncThunk('/pdf/addnewEmail', async ({ userId, email, groupId, authToken }, {
    rejectWithValue
}) => {
    try {
        const response = await axios.post(`/api/PDF/addnewmail?UserId=${userId}&newEmail=${email}&GroupId=${groupId}`, {}, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
        return response?.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Can not add new Email')
    }
})

export const deleteEmail = createAsyncThunk('/pdf/deleteemail', async ({ userId, groupEmailId, authToken }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`/api/PDF/deleteemail?UserId=${userId}&GroupEmailId=${groupEmailId}`, {}, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
        return response?.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Can not delete Emalil')
    }
})

const groupDataSlice = createSlice({
    name: 'group',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addGroup.pending, (state) => {
            state.isLoading = true;
        }).addCase(addGroup.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
        }).addCase(addGroup.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action?.payload;
        }).addCase(getGroupsByUserId.pending, (state) => {
            state.isLoading = true;
        })
            .addCase(getGroupsByUserId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.groupList = action.payload;
                state.error = null;
            })
            .addCase(getGroupsByUserId.rejected, (state, action) => {
                state.isLoading = false;
                state.groupList = [];
                state.error = action.payload;
            }).addCase(deleteGroup.pending, (state) => {
                state.isLoading = true
            }).addCase(deleteGroup.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null
            }).addCase(deleteGroup.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action?.payload;
            }).addCase(addNewEmail.pending, (state) => {
                state.isLoading = true;
            }).addCase(addNewEmail.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null
            }).addCase(addNewEmail.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action?.payload;
            }).addCase(deleteEmail.pending, (state) => {
                state.isLoading = true;
            }).addCase(deleteEmail.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
            }).addCase(deleteEmail.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    }
})

export default groupDataSlice.reducer;

