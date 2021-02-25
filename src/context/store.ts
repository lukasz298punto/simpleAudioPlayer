import { configureStore } from '@reduxjs/toolkit';
import citiesReducer from 'context/features/cities/citiesSlice';

export const store = configureStore({
    reducer: {
        cities: citiesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
