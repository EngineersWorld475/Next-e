import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    collectionList: null,
    error: null
}

export const saveaFile = createAsyncThunk('/pdf/savefile', async ({ userId, article, url, pubmedid, author, doi, authToken }, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            `/api/PDF/savefile?userId=${userId}`,
            { article, url, pubmedid, author, doi },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        return response?.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Can not save File');
    }
});


const collectionSlice = createSlice({
    name: 'collection',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(saveaFile.pending, (state) => {
            state.isLoading = true
        }).addCase(saveaFile.fulfilled, (state, action) => {
            state.isLoading = false;
            state.collectionList = action.payload;
            state.error = null;
        }).addCase(saveaFile.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
    }
})

export default collectionSlice.reducer;