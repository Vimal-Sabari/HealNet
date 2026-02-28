import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = '/api/reports/'

// Create new report
export const createReport = createAsyncThunk('reports/create', async (reportData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        const response = await axios.post(API_URL, reportData, config)
        return response.data
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Get all reports (Admin)
export const getReports = createAsyncThunk('reports/getAll', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        const response = await axios.get(API_URL, config)
        return response.data
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Update report status (Admin)
export const updateReportStatus = createAsyncThunk('reports/updateStatus', async ({ id, status }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        const response = await axios.put(API_URL + id, { status }, config)
        return response.data
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const initialState = {
    reports: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}

export const reportSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createReport.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createReport.fulfilled, (state) => {
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(createReport.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getReports.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getReports.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.reports = action.payload
            })
            .addCase(getReports.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(updateReportStatus.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.reports = state.reports.map((report) =>
                    report._id === action.payload._id ? action.payload : report
                )
            })
    },
})

export const { reset } = reportSlice.actions
export default reportSlice.reducer
