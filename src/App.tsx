import {
    LoadingOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import { Button, Image, List, message, Spin, Upload } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { RcFile } from 'antd/lib/upload';
import 'App.less';
import { selectLoading, setLoading } from 'context/features/globalSlice';
import { addFile, selectUploadFiles } from 'context/features/uploadFilesSlice';
import { intervalToDuration } from 'date-fns';
import * as jsmediatags from 'jsmediatags-web';
import { get } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDispatch, useSelector } from 'react-redux';

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
    const ref = useRef<HTMLAudioElement | null>(null);
    const [src, setSrc] = useState('');
    const dispatch = useDispatch();
    const files = useSelector(selectUploadFiles);
    const loading = useSelector(selectLoading);

    console.log(files, 'files');

    async function readFile(file: RcFile) {
        dispatch(setLoading(true));

        try {
            const src = await convertToArrayBuffer(file);
            // const d: any = document.getElementById('audio');
            const x = ref?.current;
            if (x) {
                x.src = src;
            }
            const tags = await getTags(file);
            const cover = await getAudioCover(tags);

            console.log(tags, 'tags');
            console.log(get(tags, 'album'), 'album');
            // setSrc(coverSrc);

            dispatch(
                addFile({
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

    const formatNumberTime = (time: number) =>
        time < 10 ? `0${time}` : `${time}`;

    const getAudioDuration = (duration: number) => {
        const intDuration = intervalToDuration({
            start: 0,
            end: duration * 1000,
        });

        return `${formatNumberTime(
            intDuration.minutes || 0
        )}:${formatNumberTime(intDuration.seconds || 0)}`;
    };

    useEffect(() => {
        const audioRef = document.getElementById('audio');
        console.log(audioRef);
    }, []);

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    return (
        <Spin spinning={loading}>
            <Scrollbars
                style={{ height: '100vh' }}
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
                <div className="App">
                    <audio
                        id="audio"
                        ref={ref}
                        controls
                        onTimeUpdate={(e) =>
                            console.log(
                                getAudioDuration(ref?.current?.currentTime || 0)
                            )
                        }
                    />
                    <Image src={src} />
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
                        <Button type="primary" icon={<UploadOutlined />}>
                            Select File
                        </Button>
                    </Upload>
                    <Button
                        type="primary"
                        shape="circle"
                        size="large"
                        icon={
                            <PlayCircleOutlined
                                onClick={() => ref.current?.play()}
                            />
                        }
                    />
                    <Button
                        type="primary"
                        shape="circle"
                        size="large"
                        icon={
                            <PauseCircleOutlined
                                onClick={() => ref.current?.pause()}
                            />
                        }
                    />
                    {getAudioDuration(ref.current?.duration || 0)}
                    <List
                        itemLayout="horizontal"
                        dataSource={files}
                        renderItem={(item) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.cover} />}
                                    title={item.title}
                                    description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                />
                            </List.Item>
                        )}
                    />
                </div>
            </Scrollbars>
        </Spin>
    );
}

export default App;
