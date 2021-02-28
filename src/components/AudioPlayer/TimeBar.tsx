import { Slider as AntSlider } from 'antd';
import 'App.less';
import {
    selectCurrentTime,
    selectDuration,
} from 'context/features/audioPlayerSlice';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

type Props = {
    setAudioCurrentTime: (value: number) => void;
    setIsPlaying: (value: boolean) => void;
    isPlaying: boolean;
};

const Slider = styled(AntSlider)`
    flex: 1;
`;

function TimeBar({ setAudioCurrentTime, setIsPlaying, isPlaying }: Props) {
    const duration = useSelector(selectDuration);
    const currentTime = useSelector(selectCurrentTime);
    const isPlayingInitialValue = useRef<null | boolean>(null);

    return (
        <Slider
            value={currentTime}
            min={0}
            max={duration}
            onChange={(e: any) => {
                if (isPlayingInitialValue.current === null) {
                    isPlayingInitialValue.current = isPlaying;
                }
                setIsPlaying(false);
                setAudioCurrentTime(e);
            }}
            onAfterChange={(e: any) => {
                setIsPlaying(!!isPlayingInitialValue.current);
                isPlayingInitialValue.current = null;
            }}
        />
    );
}

export default TimeBar;
