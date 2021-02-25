import {
    PauseCircleOutlined,
    PlayCircleOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import { Button, Image, message, Upload } from 'antd';
import 'antd/dist/antd.css';
import { intervalToDuration } from 'date-fns';
import * as jsmediatags from 'jsmediatags-web';
import React, { useEffect, useRef, useState } from 'react';

interface FileInfo {
    tags: {
        picture?: {
            data: number[];
            format: string;
        };
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
    const [fileList, setFileList] = useState<any[]>([]);
    const [src, setSrc] = useState('');

    async function readFile(files: File) {
        const res = await convertToArrayBuffer(files);
        // const d: any = document.getElementById('audio');
        const x = ref?.current;
        if (x) {
            x.src = res;
        }
        const coverSrc = await getAudioCover(files);

        setSrc(coverSrc);
    }

    function convertToArrayBuffer(files: any) {
        return new Promise<string>((resolve, reject) => {
            var fr = new FileReader();
            fr.readAsDataURL(files);
            fr.onload = () => {
                resolve(fr.result as string);
            };
            fr.onerror = (error) => {
                reject(error);
            };
        });
    }

    const getAudioCover = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            jsmediatags.read(file, {
                onSuccess({ tags }: FileInfo) {
                    console.log(tags, 'tags');
                    const { picture } = tags;
                    if (!picture) {
                        return reject('File doesnt contain cover');
                    }

                    const { data } = picture;
                    const base64String = data
                        .map((value) => String.fromCharCode(value))
                        .join('');
                    const coverSrc = `data:${
                        picture.format
                    };base64,${window.btoa(base64String)}`;

                    resolve(coverSrc);
                },
                onError(error: Error) {
                    reject(error);
                },
            });
        });
    };

    useEffect(() => {}, []);

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

    return (
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
                fileList={fileList}
                beforeUpload={(file) => {
                    if (!validateAudioFile(file.type)) {
                        message.error('Incorrect audio format');
                        return false;
                    }
                    console.log(file.type, 'file');
                    readFile(file);
                    setFileList([file]);
                    return false;
                }}
            >
                <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
            <Button
                type="primary"
                shape="circle"
                size="large"
                icon={
                    <PlayCircleOutlined onClick={() => ref.current?.play()} />
                }
            />
            <Button
                type="primary"
                shape="circle"
                size="large"
                icon={
                    <PauseCircleOutlined onClick={() => ref.current?.pause()} />
                }
            />
            {getAudioDuration(ref.current?.duration || 0)}
            {console.log()}
        </div>
    );
}

export default App;
