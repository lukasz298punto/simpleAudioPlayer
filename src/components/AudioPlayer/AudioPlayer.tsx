import {
    BackwardOutlined,
    FastBackwardOutlined,
    FastForwardOutlined,
    ForwardOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined,
    RedoOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import { TimeBar, TimeBlock } from 'components/AudioPlayer';
import {
    selectCurrentTime,
    selectDuration,
    setCurrentTime,
    setDuration,
} from 'context/features/audioPlayerSlice';
import { selectUploadFiles } from 'context/features/uploadFilesSlice';
import { get } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

const Player = styled.div`
    background-color: green;

    .ant-slider-track {
        background-color: red;
    }
`;

function Blocke() {
    console.count('Blocke');
    const durr = useSelector(selectCurrentTime);

    return <div>{durr}</div>;
}

function AudioPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isCanPlay, setIsCanPlay] = useState(false);
    // const [duration, setDuration] = useState(0);
    // const [currentTime, setCurrentTime] = useState(0);
    const ref = useRef<HTMLAudioElement | null>(null);
    const dispatch = useDispatch();
    let audio = null;

    const duration = useSelector(selectDuration);

    console.count('AudioPlayer');

    const files = useSelector(selectUploadFiles);

    const stop = () => {
        setIsPlaying(false);
    };

    const play = () => {
        setIsPlaying(true);
    };

    const setAudioCurrentTime = (value: number) => {
        const audioRef = ref.current as HTMLAudioElement;
        audioRef.currentTime = value;
    };

    const rewind = () => {
        setAudioCurrentTime(0);
    };

    const fastForward = () => {
        setAudioCurrentTime(duration);
        setIsPlaying(false);
    };

    useEffect(() => {
        if (isPlaying) {
            ref.current?.play();
        } else {
            ref.current?.pause();
        }
    }, [isPlaying]);

    return (
        <Player>
            <Button
                disabled={!isCanPlay}
                size="large"
                type="primary"
                shape="circle"
                icon={<BackwardOutlined />}
                onClick={rewind}
            />
            <Button
                disabled={!isCanPlay}
                size="large"
                type="primary"
                shape="circle"
                icon={<FastBackwardOutlined />}
            />
            <Button
                disabled={!isCanPlay}
                size="large"
                type="primary"
                shape="circle"
                icon={<FastForwardOutlined />}
            />
            <Button
                disabled={!isCanPlay}
                size="large"
                type="primary"
                shape="circle"
                icon={<ForwardOutlined />}
                onClick={fastForward}
            />
            <Button
                disabled={!isCanPlay}
                size="large"
                type="primary"
                shape="circle"
                icon={<RedoOutlined />}
            />
            {isPlaying ? (
                <Button
                    disabled={!isCanPlay}
                    size="large"
                    type="primary"
                    shape="circle"
                    icon={<PauseCircleOutlined />}
                    onClick={stop}
                />
            ) : (
                <Button
                    disabled={!isCanPlay}
                    size="large"
                    type="primary"
                    shape="circle"
                    icon={<PlayCircleOutlined />}
                    onClick={play}
                />
            )}
            <TimeBlock selector={selectCurrentTime} />
            <audio
                src={get(files, '[0].src')}
                id="audio"
                ref={ref}
                // controls
                onCanPlay={() => setIsCanPlay(true)}
                onLoadedData={() =>
                    dispatch(setDuration(ref?.current?.duration || 0))
                }
                onTimeUpdate={
                    (e) =>
                        dispatch(setCurrentTime(ref?.current?.currentTime || 0))
                    // setCurrentTime(ref?.current?.currentTime || 0)
                }
            />
            <TimeBlock selector={selectDuration} />
            <TimeBar
                setAudioCurrentTime={setAudioCurrentTime}
                setIsPlaying={setIsPlaying}
            />
        </Player>
    );
}

export default AudioPlayer;
