import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    parts: [],
    isLoading: false,
    error: null,
};

const inventorySlice = createSlice({
    name: "inventory",
    initialState,
    reducers: {
        setParts: (state, action) => {
            state.parts = action.payload;
        },
        addPart: (state, action) => {
            state.parts.push(action.payload);
        },
        removePart: (state, action) => {
            state.parts = state.parts.filter(part => part.id !== action.payload);
        },
        updatePart: (state, action) => {
            const index = state.parts.findIndex(part => part.id === action.payload.id);
            if (index !== -1) {
                state.parts[index] = action.payload;
            }
        }
    }
})

export const { setParts, addPart, removePart, updatePart } = inventorySlice.actions;
export default inventorySlice.reducer;
