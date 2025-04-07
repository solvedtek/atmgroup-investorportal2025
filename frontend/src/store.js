import { configureStore } from '@reduxjs/toolkit';
import propertiesReducer from './features/propertiesSlice.js';

// Placeholder reducer
const dummyReducer = (state = {}, action) => state;

const store = configureStore({
  reducer: {
    dummy: dummyReducer,
    properties: propertiesReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;