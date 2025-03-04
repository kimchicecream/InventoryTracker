import { configureStore } from '@reduxjs/toolkit';
import inventoryReducer from './inventorySlice';
import userReducer from "./userSlice";

const store = configureStore({
    reducer: {
        inventory: inventoryReducer,
        user: userReducer
    }
});

export default store;
