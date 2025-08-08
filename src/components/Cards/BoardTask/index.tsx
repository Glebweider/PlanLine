import style from './BoardTaskCard.module.scss';
import { ICard, IProject } from '../../../redux/reducers/projectReducer';
import formatDateShortEn from '../../../utils/FormatDateShortEn';
import { Avatar } from '../../Avatar';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useDrag } from 'react-dnd';


interface BoardTaskCardProps {
    card: ICard;
    listId: string;
    projectState: IProject;
}

const BoardTaskCard: React.FC<BoardTaskCardProps> = ({ card, listId, projectState }) => {
    const [{ isDragging }, dragRef] = useDrag({
        type: 'CARD',
        item: () => ({ card, listId }),
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    }, [card, listId]);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

    return (
        <div
            ref={dragRef}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            onClick={() => setIsOpenModal(true)}
            className={style.container}>
            <text style={{ fontSize: 18 }}>{card.title}</text>
            <text style={{ fontSize: 14 }} className={style.description}>{card.description}</text>
            <div className={style.footer}>
                {card.dueDate &&
                    <div className={style.projectDataContainer}>
                        <ClockCircleOutlined style={{ fontSize: 14 }} />
                        <text className={style.projectDataText}>{formatDateShortEn(`${card.dueDate}`)}</text>
                    </div>
                }
                <div>
                    {card.members
                        .slice(0, 4)
                        .map((member) => (
                            <Avatar
                                key={member}
                                size={25}
                                user={projectState.members.find((m) => m.id === member)}
                                className={style.memberAvatar} />
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default BoardTaskCard;
