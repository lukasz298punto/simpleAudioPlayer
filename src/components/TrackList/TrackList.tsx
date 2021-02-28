import { List } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import 'App.less';
import {
    selectFile,
    selectUploadFiles,
    setSelectFile,
} from 'context/features/filesSlice';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

const { Item: AntItem } = List;

const ListItem = styled(AntItem)<{ selected: 0 | 1 }>`
    &:hover {
        cursor: pointer;
        background-color: #095cb575;
    }
    && {
        background-color: ${({ selected }) => (selected ? '#095cb5' : null)};
    }
`;

function TrackList() {
    const files = useSelector(selectUploadFiles);
    const dispatch = useDispatch();
    const selectedFile = useSelector(selectFile);

    return (
        <List
            itemLayout="horizontal"
            dataSource={files}
            renderItem={(fileItem) => (
                <ListItem
                    selected={selectedFile?.uid === fileItem.uid ? 1 : 0}
                    style={{}}
                    onClick={() => {
                        dispatch(setSelectFile(fileItem));
                    }}
                >
                    <ListItem.Meta
                        avatar={<Avatar src={fileItem.cover} />}
                        title={fileItem.artist}
                        description={fileItem.title}
                    />
                </ListItem>
            )}
        />
    );
}

export default TrackList;
