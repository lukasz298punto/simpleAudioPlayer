import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'context/store';

type AudioPlayer = {
    htmlRef?: HTMLAudioElement;
};

const initialState: AudioPlayer = {};

export const audioPlayerSlice = createSlice({
    name: 'audioPlayer',
    initialState,
    reducers: {
        setRef: (state, action: PayloadAction<HTMLAudioElement>) => {
            state.htmlRef = action.payload as any;
        },
    },
});

export const { setRef } = audioPlayerSlice.actions;

export const selectAudioPlayer = (state: RootState) => state.audioPlayer;

export default audioPlayerSlice.reducer;
