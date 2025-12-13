import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

import style from './Board.module.scss';
import { Avatar } from '../Avatar';
import { IBoard } from '../../redux/reducers/projectReducer';
import { RootState } from '../../redux/store';
import { useAlert } from '../Alert/context';


interface BoardProps {
    projectId: string;
    board: IBoard;
}

const BoardCard: React.FC<BoardProps> = ({ projectId, board }) => {
    const { showAlert } = useAlert();

    const projectState = useSelector((state: RootState) => state.projectReducer);
    const userId = useSelector((state: RootState) => state.userReducer.id);

    const [isOpenBoardMenu, setIsOpenBoardMenu] = useState<boolean>(false);
    const [isRenamedBoard, setIsRenamedBoard] = useState<boolean>(false);
    const [newBoardName, setNewBoardName] = useState<string>(board.name);
    const [selectedBoardId, setSelectedBoardId] = useState<string>('');

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleRenameBoard = async () => {
        setIsRenamedBoard(false);

        const trimmedName = newBoardName.trim();
        if (trimmedName === '' || trimmedName === board.name) {
            setNewBoardName(board.name);
            return;
        }

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/${projectId}/boards/${selectedBoardId}`,
                {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: trimmedName
                    })
                }
            );

            if (!response.ok) {
                const data = await response.json();
                showAlert(`Server error: ${response.status}, ${data.message}`);
                return;
            }
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
        }
    };

    return (
        <div style={{ display: 'flex', position: 'relative' }}>
            <Link
                to={`/project/${projectId}/${board.id}`}
                key={board.id}
                className={style.container}
                onClick={(e) => {
                    if (isRenamedBoard) {
                        e.preventDefault();
                    }
                }}>
                <div className={style.header}>
                    {!isRenamedBoard ? (
                        <a
                            className={style.boardName}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setTimeout(() => textareaRef.current?.focus(), 0);
                            }}>
                            {board.name}
                        </a>
                    ) : (
                        <textarea
                            ref={textareaRef}
                            className={style.boardTextArea}
                            value={newBoardName}
                            onChange={(e) => setNewBoardName(e.target.value)}
                            onBlur={handleRenameBoard}
                            maxLength={16}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleRenameBoard();
                                    textareaRef.current?.blur();
                                }
                            }}
                            rows={1} />
                    )}
                    {userId === projectState.ownerId && (
                        <MoreOutlined
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedBoardId(board.id);
                                setIsOpenBoardMenu(!isOpenBoardMenu);
                            }}
                            style={{ fontSize: 30, marginRight: -10 }} />
                    )}
                </div>

                {board.lists.length !== 0 && (
                    <div className={style.listsContainer}>
                        {board.lists.map((list) => (
                            <span key={list.id} className={style.list}>
                                Tasks {list.name}: {list.cards.length}
                            </span>
                        ))}
                    </div>
                )}
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
                        ))
                    }
                </div>
            </Link>
        </div>
    );
};

export default BoardCard;
