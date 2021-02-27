import { Slider } from 'antd';
import 'App.less';
import {
    selectCurrentTime,
    selectDuration,
} from 'context/features/audioPlayerSlice';
import React from 'react';
import { useSelector } from 'react-redux';

type Props = {
    setAudioCurrentTime: (value: number) => void;
    setIsPlaying: (value: boolean) => void;
};

function TimeBar({ setAudioCurrentTime, setIsPlaying }: Props) {
    const duration = useSelector(selectDuration);
    const currentTime = useSelector(selectCurrentTime);

    // useEffect(() => {
    //     setTime(currentTime);
    // }, [currentTime]);

    console.count('TimeBar');
    return (
        <Slider
            // defaultValue={0}
            value={currentTime}
            min={0}
            max={duration}
            onChange={(e: any) => {
                setIsPlaying(false);
                setAudioCurrentTime(e);
            }}
            onAfterChange={(e: any) => setIsPlaying(true)}
        />
    );
}

export default TimeBar;
