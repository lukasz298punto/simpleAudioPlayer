import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Maybe } from 'constants/types';
import { RootState } from 'context/store';

export type AudioFile = {
    uid: string;
    type: string;
    cover: Maybe<string>;
    album: Maybe<string>;
    artist: Maybe<string>;
    title: Maybe<string>;
    year: Maybe<string>;
    src: string;
};

const initialState: AudioFile[] = [];

export const uploadFilesSlice = createSlice({
    name: 'uploadFiles',
    initialState,
    reducers: {
        addFile: (state, action: PayloadAction<AudioFile>) => {
            state.push(action.payload);
        },
    },
});

export const { addFile } = uploadFilesSlice.actions;

export const selectUploadFiles = (state: RootState) => state.uploadFiles;

export default uploadFilesSlice.reducer;
