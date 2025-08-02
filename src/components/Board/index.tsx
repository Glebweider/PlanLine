import React from 'react';
import { Link } from 'react-router-dom';
import { MoreOutlined } from '@ant-design/icons';

import style from './Board.module.scss';
import { Avatar } from '../Avatar';
import { IBoard } from '../../redux/reducers/projectReducer';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';


interface BoardProps {
    projectId: string | undefined;
    board: IBoard;
}

const BoardCard: React.FC<BoardProps> = ({ projectId, board }) => {
    const projectState = useSelector((state: RootState) => state.projectReducer);
    const userId = useSelector((state: RootState) => state.userReducer.id);

    return (
        <Link
            to={`/project/${projectId}/${board.id}`}
            key={board.id}
            className={style.container}>

            <div className={style.header}>
                <a className={style.boardName}>{board.name}</a>
                {userId == projectState.ownerId &&
                    <MoreOutlined
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                        }}
                        style={{ fontSize: 30, marginRight: -10 }} />
                }
            </div>
            {board.lists.length !== 0 &&
                <div className={style.listsContainer}>
                    {board.lists.map((list) => (
                        <span key={list.id} className={style.list}>
                            Tasks {list.name}: {list.cards.length}
                        </span>
                    ))}
                </div>
            }
            <div className={style.members}>
                {board.members
                    .filter((member) => member.role !== 'Observer')
                    .slice(0, 9)
                    .map((member) => (
                        <Avatar
                            key={member.id}
                            size={32}
                            user={projectState.members.find((m) => m.id === member.id)}
                            className={style.memberAvatar} />
                    ))}
            </div>
        </Link>
    );
};

export default BoardCard;
