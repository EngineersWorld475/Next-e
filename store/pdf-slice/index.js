import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    collectionList: null,
    error: null
}

export const saveFile = createAsyncThunk('/pdf/savefile', async ({ formData, authToken }, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            `/api/PDF/savefile`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return response?.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Can not save File');
    }
});

export const getCollections = createAsyncThunk('/pdf/getcollections', async ({userId, authToken}, {rejectWithValue}) => {
    try {
        const response = await axios.get(`/api/mock/PDF/getCollections?userId=${userId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
        return response?.data?.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Can not fetch files');
    }
})

export const editPdf = createAsyncThunk('/pdf/editpdf', async ({ article, pubmedid, author, doi, userId, authToken }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`/api/PDF/editpdf?UId=${userId}`, { article, pubmedid, author, doi }, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
        return response?.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Can not edit file')
    }
})

export const deletePdf = createAsyncThunk('/pdf/deletepdf', async ({ userId, id, authToken }, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`/api/mock/PDF/deleteCollection?userId=${userId}&id=${id}`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });
        return response?.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Can not delete File');
    }
})

export const searchPdf = createAsyncThunk('/pdf/searchPdf', async ({ keyword, authToken }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/api/mock/PDF/searchCollection?keyword=${keyword}`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });
        return response?.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Can not fetch collection')
    }
})



const collectionSlice = createSlice({
    name: 'collection',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(saveFile.pending, (state) => {
            state.isLoading = true
        }).addCase(saveFile.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
        }).addCase(saveFile.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(getCollections.pending, (state) => {
            state.isLoading = true;
        }).addCase(getCollections.fulfilled, (state, action) => {
            state.isLoading = false;
            state.collectionList = action.payload;
            state.error = null;
        }).addCase(getCollections.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(editPdf.pending, (state) => {
            state.isLoading = true;
        }).addCase(editPdf.fulfilled, (state, action) => {
            state.isLoading = false;
            state.collectionList = action.payload;
            state.error = null
        }).addCase(editPdf.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action?.payload
        }).addCase(deletePdf.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(deletePdf.fulfilled, (state) => {
            state.isLoading = false;
            state.error = null;
        }).addCase(deletePdf.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload
        }).addCase(searchPdf.pending, (state) => {
            state.isLoading = true
        }).addCase(searchPdf.fulfilled, (state, action) => {
            state.isLoading = false;
            state.collectionList = action.payload;
            state.error = null;
        }).addCase(searchPdf.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action?.payload;
        })
    }
})

export default collectionSlice.reducer;