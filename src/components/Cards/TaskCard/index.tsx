import React from 'react';
import { ArrowRightOutlined, FieldTimeOutlined } from '@ant-design/icons';

import style from './TaskCard.module.scss';
import { ICard } from '../../../redux/reducers/projectReducer';
import { useAlert } from '../../Alert/context';
import { formatDateShortRu } from '../../../utils/FormatDateShortRu';


interface TaskCardProps {
    card: ICard;
}

const TaskCard: React.FC<TaskCardProps> = ({ card }) => {

    const handleOpenModal = () => {
        console.log(1)
    };

    return (
        <div
            onClick={handleOpenModal}
            className={style.container}>
            <div className={style.content}>
                {/* TODO: Labels */}
                <text className={style.title}>{card.title}</text>
                <div className={style.footer}>
                    <div className={style.dateBlock}>
                        <FieldTimeOutlined className={style.icon} />
                        <span className={style.dateText}>{formatDateShortRu(new Date(card.createdAt))}</span>
                        {card.dueDate != null && (
                            <>
                                <ArrowRightOutlined className={style.icon} />
                                <FieldTimeOutlined  className={style.icon} />
                                <span className={style.dateText}>{formatDateShortRu(new Date(card.dueDate))}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
