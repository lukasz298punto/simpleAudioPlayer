import { configureStore } from '@reduxjs/toolkit';
import audioPlayerReducer from 'context/features/audioPlayerSlice';
import globalReducer from 'context/features/globalSlice';
import uploadFilesReducer from 'context/features/uploadFilesSlice';

export const store = configureStore({
    reducer: {
        uploadFiles: uploadFilesReducer,
        audioPlayer: audioPlayerReducer,
        global: globalReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
