import React from 'react';
import style from './Tooltip.module.scss';

type TooltipProps = {
    text: string;
    children: React.ReactNode;
};

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
    return (
        <div className={style.tooltipContainer}>
            {children}
            <span className={style.tooltipText}>{text}</span>
        </div>
    );
};

export default Tooltip;
