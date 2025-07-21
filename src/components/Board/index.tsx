import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import style from './Board.module.scss';
import { Avatar } from '../Avatar';
import { IBoard, setProject } from '../../redux/reducers/projectReducer';
import textAreaHandleInput from '../../utils/TextAreaFunc';
import { RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from '../Alert/context';

interface BoardProps {
    projectId: string | undefined;
    board: IBoard;
}

const BoardItem: React.FC<BoardProps> = ({ projectId, board }) => {
    const projectState = useSelector((state: RootState) => state.projectReducer);
    const { showAlert } = useAlert();
	const dispatch = useDispatch();


    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [name, setName] = useState<string>(board.name);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setName(e.target.value);

        textAreaHandleInput(e);
    };

    const updateBoard = async () => {
        const boardName = name.trim();

        if (boardName === board.name) return;

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/${projectId}/boards/${board.id}`,
                {
                    method: 'PUT',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: boardName })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                showAlert(`Server error: ${response.status}, ${data.message}`);
                return;
            }

            dispatch(setProject({
                ...projectState,
                boards: projectState.boards.map(b => b.id === board.id ? data : b)
            }));
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
        }
    };

    const handleBlur = () => {
        setIsEditing(false);
        updateBoard();
    };

    return (
        <Link
            to={`/project/${projectId}/board/${board.id}`}
            key={board.id}
            className={style.boardContainer}
            onClick={(e) => {
                if (isEditing) e.preventDefault();
            }}>
            {!isEditing ? (
                <span
                    className={style.boardName}
                    onClick={(e) => {
                        e.preventDefault();
                        setIsEditing(true);
                        setTimeout(() => {
                            if (textareaRef.current) {
                                textareaRef.current.focus();
                                textareaRef.current.style.height = 'auto';
                                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                            }
                        }, 0);
                    }}>
                        {name}
                </span>
            ) : (
                <textarea
                    ref={textareaRef}
                    className={style.inputField}
                    value={name}
                    onChange={handleInput}
                    onBlur={handleBlur}
                    maxLength={256}
                    rows={1}/>
            )}

            {board.lists.length !== 0 &&
                board.lists.map((list) => (
                <div key={list.id} className={style.boardListContainer}>
                    <span className={style.boardList}>
                        Tasks {list.name}: {list.cards.length}
                    </span>
                </div>
            ))}

            <div className={style.boardMembers}>
                {board.members
                .filter((member) => member.role !== 'Observer')
                .slice(0, 8)
                .map((member) => (
                    <Avatar
                    key={member.id}
                    size={32}
                    user={projectState.members.find((m) => m.id === member.id)}
                    className={style.boardMemberAvatar}/>
                ))}
            </div>
        </Link>
    );
};

export default BoardItem;
