import 'App.less';
import { RootState } from 'context/store';
import { intervalToDuration } from 'date-fns';
import React from 'react';
import { useSelector } from 'react-redux';

const formatNumberTime = (time: number) => (time < 10 ? `0${time}` : `${time}`);

const getAudioDuration = (duration: number) => {
    const intDuration = intervalToDuration({
        start: 0,
        end: duration * 1000,
    });

    return `${formatNumberTime(intDuration.minutes || 0)}:${formatNumberTime(
        intDuration.seconds || 0
    )}`;
};

type Props = {
    selector: (state: RootState) => number;
};

function TimeBlock({ selector }: Props) {
    console.count('TimeBlock');
    const time = useSelector(selector);

    return <div>{getAudioDuration(time)}</div>;
}

export default TimeBlock;
