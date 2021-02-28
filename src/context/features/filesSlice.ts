import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetArrayType, Maybe } from 'constants/types';
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

type Initial = {
    uploadFiles: AudioFile[];
    selectedFile: AudioFile | null;
};

const initialState: Initial = {
    uploadFiles: [],
    selectedFile: null,
};

export const filesSlice = createSlice({
    name: 'files',
    initialState,
    reducers: {
        addUploadFile: (
            state,
            action: PayloadAction<
                GetArrayType<typeof initialState['uploadFiles']>
            >
        ) => {
            state.uploadFiles.push(action.payload);
        },
        setSelectFile: (
            state,
            action: PayloadAction<typeof initialState['selectedFile']>
        ) => {
            state.selectedFile = action.payload;
        },
    },
});

export const { addUploadFile, setSelectFile } = filesSlice.actions;

export const selectUploadFiles = (state: RootState) => state.files.uploadFiles;

export const selectFile = (state: RootState) => state.files.selectedFile;

export default filesSlice.reducer;
