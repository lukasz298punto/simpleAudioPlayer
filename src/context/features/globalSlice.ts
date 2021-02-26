import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'context/store';

const initialState = {
    loading: false,
};

export const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setLoading: (
            state,
            action: PayloadAction<typeof initialState.loading>
        ) => {
            state.loading = action.payload;
        },
    },
});

export const { setLoading } = globalSlice.actions;

export const selectLoading = (state: RootState) => state.global.loading;

export default globalSlice.reducer;
