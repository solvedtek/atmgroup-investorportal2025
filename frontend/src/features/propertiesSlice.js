import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Example async thunk to fetch properties
export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async () => {
    // TODO: Replace with real API call
    return [
      { id: 1, name: 'Property A' },
      { id: 2, name: 'Property B' },
    ];
  }
);

const propertiesSlice = createSlice({
  name: 'properties',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default propertiesSlice.reducer;