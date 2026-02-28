import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = '/api/insights/'

// Save or unsave an insight
export const toggleSaveInsight = createAsyncThunk('insights/toggle', async (experienceId, thunkAPI) => {
    try {
        const { auth } = thunkAPI.getState()
        const config = { headers: { Authorization: `Bearer ${auth.user?.token}` } }
        const response = await axios.post(API_URL + 'save', { experienceId }, config)
        return { experienceId, saved: response.data.saved }
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Get my saved insights
export const getMySavedInsights = createAsyncThunk('insights/getMe', async (_, thunkAPI) => {
    try {
        const { auth } = thunkAPI.getState()
        const config = { headers: { Authorization: `Bearer ${auth.user?.token}` } }
        const response = await axios.get(API_URL + 'me', config)
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Delete a saved insight
export const deleteSavedInsight = createAsyncThunk('insights/delete', async (experienceId, thunkAPI) => {
    try {
        const { auth } = thunkAPI.getState()
        const config = { headers: { Authorization: `Bearer ${auth.user?.token}` } }
        await axios.delete(API_URL + experienceId, config)
        return experienceId
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const initialState = {
    savedInsights: [],
    savedIds: [],       // set of saved experienceIds for quick lookup
    isLoading: false,
    isError: false,
    message: '',
}

export const insightsSlice = createSlice({
    name: 'insights',
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false
            state.isLoading = false
            state.message = ''
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMySavedInsights.pending, (state) => { state.isLoading = true })
            .addCase(getMySavedInsights.fulfilled, (state, action) => {
                state.isLoading = false
                state.savedInsights = action.payload
                state.savedIds = action.payload.map(e => e?._id).filter(Boolean)
            })
            .addCase(getMySavedInsights.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(toggleSaveInsight.fulfilled, (state, action) => {
                const { experienceId, saved } = action.payload
                if (saved) {
                    if (!state.savedIds.includes(experienceId)) state.savedIds.push(experienceId)
                } else {
                    state.savedIds = state.savedIds.filter(id => id !== experienceId)
                    state.savedInsights = state.savedInsights.filter(e => e?._id !== experienceId)
                }
            })
            .addCase(deleteSavedInsight.fulfilled, (state, action) => {
                const id = action.payload
                state.savedIds = state.savedIds.filter(sid => sid !== id)
                state.savedInsights = state.savedInsights.filter(e => e?._id !== id)
            })
    },
})

export const { reset } = insightsSlice.actions
export default insightsSlice.reducer
