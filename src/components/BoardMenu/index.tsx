import { useDispatch, useSelector } from 'react-redux';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import style from './BoardMenu.module.scss';
import { RootState } from '../../redux/store';
import { useAlert } from '../Alert/context';
import { deleteBoardFromProject } from '../../redux/reducers/projectReducer';


interface BoardMenuProps {
    textareaRef: React.RefObject<HTMLTextAreaElement>;
    isOpenModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    setIsRenameBoard: React.Dispatch<React.SetStateAction<boolean>>;
    isRenameBoard: boolean;
    projectOwnerId: string;
    projectId: string;
    boardId: string;
}

const BoardMenu: React.FC<BoardMenuProps> = ({ textareaRef, isOpenModal, projectOwnerId, projectId, boardId, setOpenModal, isRenameBoard, setIsRenameBoard }) => {
    const { showAlert } = useAlert();
    const dispatch = useDispatch();
    
    const userId = useSelector((state: RootState) => state.userReducer.id);

    const [isOpenMdl, setIsOpenMdl] = useState<boolean>(false);
    const [isDeleteBoard,setIsDeleteBoard] = useState<boolean>(false);


    useEffect(() => {
        if (isOpenModal) {
            setIsOpenMdl(true);
        } else {
            const timer = setTimeout(() => {
                setIsOpenMdl(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isOpenModal]);

    const renameBoard = async () => {
        setIsRenameBoard(true);
        textareaRef.current?.focus();
        setOpenModal(false);
    };

    const deleteBoard = async () => {
        if (isDeleteBoard) return;

        setIsDeleteBoard(true);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/${projectId}/boards/${boardId}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                }
            );

            if (!response.ok) {
                const data = await response.json();
                showAlert(`Server error: ${response.status}, ${data.message}`);
                return;
            }

            dispatch(deleteBoardFromProject(boardId));
            setOpenModal(false);
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
        } finally {
            setIsDeleteBoard(false);
        }
    };


    if (!isOpenMdl) return <></>

    return (
        <div className={`${style.container} ${isOpenModal ? style.open : ''}`}>
            {projectOwnerId == userId &&
                <div
                    onClick={renameBoard}
                    className={style.content}>
                    <EditOutlined style={{ fontSize: 20 }} />
                    <text>Rename</text>
                </div>
            }
            {projectOwnerId == userId &&
                <div
                    onClick={deleteBoard}
                    className={style.content}>
                    <DeleteOutlined style={{ color: '#FF2D20', fontSize: 20 }} />
                    <text style={{ color: '#FF2D20' }}>Delete</text>
                </div>
            }
        </div>
    );
};

export default BoardMenu;
