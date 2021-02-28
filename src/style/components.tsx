import { Button } from 'antd';
import styled from 'styled-components';

export const ToggleButton = styled(Button)<{ active: 0 | 1 }>`
    &.ant-btn,
    &.ant-btn:focus {
        background-color: ${({ active }) => (active ? '#095cb5' : null)};
        border-color: ${({ active }) => (active ? '#095cb5' : null)};
    }

    &.ant-btn:hover {
        background-color: ${({ active }) => (active ? '#177ddc' : null)};
        border-color: ${({ active }) => (active ? '#177ddc' : null)};
    }
`;
