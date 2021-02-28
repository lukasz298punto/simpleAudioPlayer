import {
    BackwardOutlined,
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
import { AudioFile } from 'context/features/filesSlice';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToggleButton } from 'style/components';
import styled from 'styled-components';

const Player = styled.div`
    display: flex;
    background-color: #434343;
    padding: 10px;
    align-items: center;

    /* .ant-slider-track {
        background-color: red;
    } */
    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;

    & > button {
        margin: 0px 2px;
    }
`;

type Props = {
    audioFile: AudioFile;
};

function AudioPlayer({ audioFile }: Props) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isCanPlay, setIsCanPlay] = useState(false);
    const [isLooped, setIsLooped] = useState(false);
    const ref = useRef<HTMLAudioElement | null>(null);
    const dispatch = useDispatch();
    const duration = useSelector(selectDuration);

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

    const loop = () => {
        setIsLooped((prev) => !prev);
    };

    const handleTimeUpdate = () => {
        dispatch(setCurrentTime(ref?.current?.currentTime || 0));

        if (
            isTrackEnding(
                ref?.current?.currentTime || 0,
                ref?.current?.duration || 0
            ) &&
            isLooped
        ) {
            setAudioCurrentTime(0);
            ref.current?.play();
        }

        if (isTrackEnding(ref?.current?.currentTime, ref?.current?.duration)) {
            setIsPlaying(false);
        }
    };

    const isTrackEnding = (currentTime?: number, duration?: number) => {
        if (!currentTime || !duration) {
            return false;
        }

        return currentTime === duration;
    };

    useEffect(() => {
        if (isPlaying) {
            ref.current?.play();
        } else {
            ref.current?.pause();
        }
    }, [isPlaying, audioFile]);

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
                icon={<ForwardOutlined />}
                onClick={fastForward}
            />
            <ToggleButton
                disabled={!isCanPlay}
                size="large"
                type="primary"
                shape="circle"
                icon={<RedoOutlined />}
                active={isLooped ? 1 : 0}
                onClick={loop}
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
                src={audioFile.src}
                id="audio"
                ref={ref}
                onCanPlay={() => {
                    setIsCanPlay(true);
                }}
                onLoadedData={() => {
                    dispatch(setDuration(ref?.current?.duration || 0));
                }}
                onTimeUpdate={handleTimeUpdate}
            />
            <TimeBar
                setAudioCurrentTime={setAudioCurrentTime}
                setIsPlaying={setIsPlaying}
                isPlaying={isPlaying}
            />
            <TimeBlock selector={selectDuration} />
        </Player>
    );
}

export default AudioPlayer;
