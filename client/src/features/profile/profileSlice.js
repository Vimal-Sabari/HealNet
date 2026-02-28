import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = '/api/users/'

// Fetch user profile with stats
export const getUserProfile = createAsyncThunk('profile/get', async (_, thunkAPI) => {
    try {
        const { auth } = thunkAPI.getState()
        const config = { headers: { Authorization: `Bearer ${auth.user?.token}` } }
        const response = await axios.get(API_URL + 'profile', config)
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Toggle anonymous mode
export const toggleAnonymousMode = createAsyncThunk('profile/toggleAnon', async (_, thunkAPI) => {
    try {
        const { auth } = thunkAPI.getState()
        const config = { headers: { Authorization: `Bearer ${auth.user?.token}` } }
        const response = await axios.patch(API_URL + 'anonymous-mode', {}, config)
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const initialState = {
    profile: null,
    isLoading: false,
    isError: false,
    message: '',
}

export const profileSlice = createSlice({
    name: 'profile',
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
            .addCase(getUserProfile.pending, (state) => { state.isLoading = true })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.isLoading = false
                state.profile = action.payload
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(toggleAnonymousMode.fulfilled, (state, action) => {
                if (state.profile) {
                    state.profile.isAnonymous = action.payload.isAnonymous
                }
            })
    },
})

export const { reset } = profileSlice.actions
export default profileSlice.reducer
