import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'context/store';

type AudioPlayer = {
    currentTime: number;
    duration: number;
};

const initialState: AudioPlayer = {
    currentTime: 0,
    duration: 0,
};

export const audioPlayerSlice = createSlice({
    name: 'audioPlayer',
    initialState,
    reducers: {
        setCurrentTime: (state, action: PayloadAction<number>) => {
            state.currentTime = action.payload;
        },
        setDuration: (state, action: PayloadAction<number>) => {
            state.duration = action.payload;
        },
    },
});

export const { setCurrentTime, setDuration } = audioPlayerSlice.actions;

export const selectCurrentTime = (state: RootState) =>
    state.audioPlayer.currentTime;

export const selectDuration = (state: RootState) => state.audioPlayer.duration;

export default audioPlayerSlice.reducer;
