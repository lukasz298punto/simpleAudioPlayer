import { UploadOutlined } from '@ant-design/icons';
import { Button, Image, Upload } from 'antd';
import getAudioCover from 'audio-cover';
import React, { useEffect, useRef, useState } from 'react';

function App() {
    const ref = useRef<HTMLAudioElement | null>(null);
    const ref2 = useRef<HTMLInputElement | null>(null);
    const [fileList, setFileList] = useState<any[]>([]);
    const [src, setSrc] = useState('');

    async function readFile(files: File) {
        const res = await convertToArrayBuffer(files);
        // const d: any = document.getElementById('audio');
        console.log(ref.current);
        const x = ref?.current;
        if (x) {
            x.src = res;
        }
        const coverSrc = await getAudioCover(files);

        setSrc(coverSrc);

        console.log(coverSrc, 'coverSrc');
    }

    function convertToArrayBuffer(files: any) {
        return new Promise<any>((resolve, reject) => {
            var fr = new FileReader();
            fr.readAsDataURL(files);
            fr.onload = () => {
                resolve(fr.result);
            };
            fr.onerror = (error) => {
                reject(error);
            };
        });
    }

    function playAudioFile(file: ArrayBuffer) {
        var context = new window.AudioContext();
        context.decodeAudioData(file, function (buffer) {
            var source = context.createBufferSource();
            source.buffer = buffer;
            source.connect(context.destination);
            source.loop = false;
            source.start(0);
            console.log(source);
            // source.start(0);
        });
    }

    useEffect(() => {
        console.log(document.getElementById('audio'));
        console.log(ref);
        console.log(ref2);
    }, []);

    const props = {
        beforeUpload: (file: File) => {
            console.log(file);
            readFile(file);
            return false;
        },
        fileList,
    };

    return (
        <div className="App">
            <audio id="audio" ref={ref} controls />
            <Image src={src} />
            <Upload
                {...props}
                fileList={fileList}
                beforeUpload={(file) => {
                    readFile(file);
                    return false;
                }}
            >
                <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
        </div>
    );
}

export default App;
