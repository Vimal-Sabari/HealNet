import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = '/api/query/'

// Analyze symptoms
export const analyzeSymptoms = createAsyncThunk('query/analyze', async (symptoms, thunkAPI) => {
    try {
        const response = await axios.post(API_URL, { symptoms })
        return response.data
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const initialState = {
    results: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}

export const querySlice = createSlice({
    name: 'query',
    initialState,
    reducers: {
        reset: (state) => {
            state.results = null
            state.isError = false
            state.isSuccess = false
            state.isLoading = false
            state.message = ''
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(analyzeSymptoms.pending, (state) => {
                state.isLoading = true
            })
            .addCase(analyzeSymptoms.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.results = action.payload
            })
            .addCase(analyzeSymptoms.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    },
})

export const { reset } = querySlice.actions
export default querySlice.reducer
