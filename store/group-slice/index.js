import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoading: false,
    group: null,
    error: null
}

export const addGroup = createAsyncThunk("pdf/addGroup", async (groupData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`/api/PDF/addgroup?UserId=${groupData?.userid}&GroupName=${groupData?.groupName}&TagsText=${groupData?.tagsText}`, {}, {
            headers: { Authorization: `Bearer ${groupData?.authToken}` },
        });

        return response.data;
    } catch (error) {
        console.error("API error:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "An error occurred");
    }
});


export const deleteGroup = createAsyncThunk('/pdf/deleteGroup', async (userId, groupId, authToken, { }, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`/api/PDF/deletegroup?UserId=${userId}&GroupId=${groupId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });
        return response?.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Can not delete group')
    }
})

export const addNewEmail = createAsyncThunk('/pdf/addnewEmail', async (userId, email, groupId, authToken, { }, {
    rejectWithValue
}) => {
    try {
        const response = await axios.post(`/api/PDF/addnewmail?UserId=${userId}&newEmail=${email}&GroupId=${groupId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
        return response?.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Can not add new Email')
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
            state.group = action?.payload;
            state.error = null;
        }).addCase(addGroup.rejected, (state, action) => {
            state.isLoading = false;
            state.group = null;
            state.error = action?.payload;
        }).addCase(deleteGroup.pending, (state) => {
            state.isLoading = true
        }).addCase(deleteGroup.fulfilled, (action, payload) => {
            state.isLoading = false;
            state.group = action?.payload;
            state.error = null
        }).addCase(deleteGroup.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action?.payload;
        }).addCase(addNewEmail.pending, (state) => {
            state.isLoading = true;
        }).addCase(addGroup.fulfilled, (state, action) => {
            state.isLoading = false;
            state.group = action?.payload;
            state.error = null
        }).addCase(addNewEmail.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action?.payload;
        })
    }
})

export default groupDataSlice.reducer;

