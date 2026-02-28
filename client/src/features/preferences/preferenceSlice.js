import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAnonymous: JSON.parse(localStorage.getItem('isAnonymous')) || false,
}

export const preferenceSlice = createSlice({
    name: 'preference',
    initialState,
    reducers: {
        toggleAnonymous: (state) => {
            state.isAnonymous = !state.isAnonymous
            localStorage.setItem('isAnonymous', JSON.stringify(state.isAnonymous))
        },
        setAnonymous: (state, action) => {
            state.isAnonymous = action.payload
            localStorage.setItem('isAnonymous', JSON.stringify(state.isAnonymous))
        },
    },
})

export const { toggleAnonymous, setAnonymous } = preferenceSlice.actions
export default preferenceSlice.reducer
