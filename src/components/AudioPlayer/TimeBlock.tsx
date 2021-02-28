import 'App.less';
import { RootState } from 'context/store';
import { intervalToDuration } from 'date-fns';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

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

const Time = styled.div`
    margin: 0px 7px;
`;

function TimeBlock({ selector }: Props) {
    const time = useSelector(selector);

    return <Time>{getAudioDuration(time)}</Time>;
}

export default TimeBlock;
