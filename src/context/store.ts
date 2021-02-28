import { configureStore } from '@reduxjs/toolkit';
import audioPlayerReducer from 'context/features/audioPlayerSlice';
import filesReducer from 'context/features/filesSlice';
import globalReducer from 'context/features/globalSlice';

export const store = configureStore({
    reducer: {
        files: filesReducer,
        audioPlayer: audioPlayerReducer,
        global: globalReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
