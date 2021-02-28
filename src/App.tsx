import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Spin, Tabs } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import Upload, { RcFile } from 'antd/lib/upload';
import 'App.less';
import AudioPlayer from 'components/AudioPlayer';
import TrackList from 'components/TrackList';
import {
    addUploadFile,
    selectFile,
    selectUploadFiles,
} from 'context/features/filesSlice';
import { selectLoading, setLoading } from 'context/features/globalSlice';
import * as jsmediatags from 'jsmediatags-web';
import { get } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDispatch, useSelector } from 'react-redux';

const { TabPane } = Tabs;

interface FileInfo {
    tags: {
        picture?: {
            data: number[];
            format: string;
        };
        year?: string;
        album?: string;
        artist?: string;
        title?: string;
    };
}

const possibleAudioType = [
    'audio/wav',
    'audio/mpeg',
    'audio/mp4',
    'audio/aac',
    'audio/aacp',
    'audio/ogg',
    'audio/webm',
    'audio/x-caf',
    'audio/flac',
];

function App() {
    const dispatch = useDispatch();
    const files = useSelector(selectUploadFiles);
    const selectedFile = useSelector(selectFile);
    const loading = useSelector(selectLoading);
    const [isModalVisible, setIsModalVisible] = useState(false);

    async function readFile(file: RcFile) {
        dispatch(setLoading(true));

        try {
            const src = await convertToArrayBuffer(file);
            const tags = await getTags(file);
            const cover = await getAudioCover(tags);

            dispatch(
                addUploadFile({
                    uid: file.uid,
                    type: file.type,
                    cover,
                    album: get(tags, 'album'),
                    artist: get(tags, 'artist'),
                    title: get(tags, 'title'),
                    year: get(tags, 'year'),
                    src,
                })
            );
        } catch (e) {
            message.error(`Error while processing audio files`);
        } finally {
            dispatch(setLoading(false));
        }
    }

    function getTags(file: RcFile) {
        return new Promise<FileInfo['tags']>((resolve, reject) => {
            jsmediatags.read(file, {
                onSuccess({ tags }: FileInfo) {
                    resolve(tags);
                },
                onError(error: any) {
                    reject(error);
                },
            });
        });
    }

    function convertToArrayBuffer(file: RcFile) {
        return new Promise<string>((resolve, reject) => {
            var fr = new FileReader();
            fr.readAsDataURL(file);
            fr.onload = () => {
                resolve(fr.result as string);
            };
            fr.onerror = (error) => {
                reject(error);
            };
        });
    }

    const getAudioCover = (tags: FileInfo['tags']) => {
        const { picture } = tags;

        if (!picture) {
            return null;
        }

        const { data } = picture;
        const base64String = data
            .map((value) => String.fromCharCode(value))
            .join('');

        return `data:${picture.format};base64,${window.btoa(base64String)}`;
    };

    const validateAudioFile = (type: string) =>
        possibleAudioType.includes(type);

    useEffect(() => {
        if (files.length > 0) {
            setIsModalVisible(false);
        } else {
            setIsModalVisible(true);
        }
    }, [files]);

    return (
        <Spin spinning={loading}>
            <Modal
                title="Upload your favourite music"
                visible={isModalVisible}
                closable={false}
                footer={null}
                centered
            >
                <Upload
                    multiple
                    showUploadList={false}
                    beforeUpload={(file) => {
                        if (validateAudioFile(file.type)) {
                            readFile(file);
                        } else {
                            message.error(
                                `Incorrect audio format from ${file.name}`
                            );
                        }

                        return false;
                    }}
                >
                    <Button
                        type="primary"
                        loading={loading}
                        icon={<UploadOutlined />}
                    >
                        Select Files
                    </Button>
                </Upload>
            </Modal>

            <Scrollbars
                style={{ height: 'calc(100vh - 60px)' }}
                renderThumbVertical={({ style, ...props }) => {
                    const thumbStyle = {
                        color: `red`,
                    };
                    return (
                        <div
                            className="bg-color-primary"
                            style={{ ...style, ...thumbStyle }}
                            {...props}
                        />
                    );
                }}
            >
                {files.length > 0 && (
                    <div className="card-container">
                        <Tabs type="card">
                            <TabPane tab="All" key="1">
                                <TrackList />
                            </TabPane>
                            <TabPane tab="Genre" key="2">
                                <p>soon</p>
                            </TabPane>
                            <TabPane tab="Artists" key="3">
                                <p>soon</p>
                            </TabPane>
                        </Tabs>
                    </div>
                )}
            </Scrollbars>
            {selectedFile && <AudioPlayer audioFile={selectedFile} />}
        </Spin>
    );
}

export default App;
