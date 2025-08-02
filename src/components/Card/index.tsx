import React from 'react';
import style from './Card.module.scss';
import { ICard } from '../../redux/reducers/projectReducer';
import { useDispatch } from 'react-redux';
import { useAlert } from '../Alert/context';
import { formatDateShortRu } from '../../utils/FormatDateShortRu';
import { ArrowRightOutlined, FieldTimeOutlined } from '@ant-design/icons';

interface BoardProps {
    card: ICard;
}

const CardItem: React.FC<BoardProps> = ({ card }) => {
    const { showAlert } = useAlert();
    const dispatch = useDispatch();

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

export default CardItem;
