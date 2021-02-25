import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'context/store';

type CitiesState = string[];

const initialState: CitiesState = ['London', 'Warszawa'];

export const citiesSlice = createSlice({
    name: 'cities',
    initialState,
    reducers: {
        addCity: (state, action: PayloadAction<{ name: string }>) => {
            state.push(action.payload.name);
        },
        removeCity: (state, action: PayloadAction<{ name: string }>) => {
            return state.filter((city) => city !== action.payload.name);
        },
    },
});

export const { addCity, removeCity } = citiesSlice.actions;

export const selectCities = (state: RootState) => state.cities;

export default citiesSlice.reducer;
