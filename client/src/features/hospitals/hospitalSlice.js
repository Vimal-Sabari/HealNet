import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = '/api/hospitals/'

// Search hospitals
export const searchHospitals = createAsyncThunk('hospitals/search', async (query, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        const response = await axios.get(`${API_URL}?query=${query}`, config)
        return response.data
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Get all hospitals
export const getAllHospitals = createAsyncThunk('hospitals/getAll', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        const response = await axios.get(`${API_URL}all`, config)
        return response.data
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const initialState = {
    hospitals: [],
    searchResults: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}

export const hospitalSlice = createSlice({
    name: 'hospitals',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
            state.searchResults = []
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchHospitals.pending, (state) => {
                state.isLoading = true
            })
            .addCase(searchHospitals.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.searchResults = action.payload
            })
            .addCase(searchHospitals.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getAllHospitals.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getAllHospitals.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.hospitals = action.payload
            })
            .addCase(getAllHospitals.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    },
})

export const { reset } = hospitalSlice.actions
export default hospitalSlice.reducer
