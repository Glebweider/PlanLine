import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import style from './ListMenu.module.scss';
import { useAlert } from '../../Alert/context';
import { deleteListFromBoard } from '../../../redux/reducers/projectReducer';


interface ListMenuProps {
    textareaRef: React.RefObject<HTMLTextAreaElement>;
    isOpenModal: boolean;
    projectId: string;
    boardId: string;
    listId: string;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    setIsRenameList: React.Dispatch<React.SetStateAction<boolean>>;
}

const ListMenu: React.FC<ListMenuProps> = ({ textareaRef, isOpenModal, projectId, boardId, listId, setOpenModal, setIsRenameList }) => {
    const { showAlert } = useAlert();
    const dispatch = useDispatch();

    const [isOpenMdl, setIsOpenMdl] = useState<boolean>(false);
    const [isUseList, setIsUseList] = useState<boolean>(false);


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

    const renameList = async () => {
        setIsRenameList(true);
        textareaRef.current?.focus();
        setOpenModal(false);
    };

    const deleteList = async () => {
        if (isUseList) return;

        setIsUseList(true);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/${projectId}/boards/${boardId}/${listId}`,
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

            dispatch(deleteListFromBoard({
                boardId: boardId,
                listId: listId
            }));
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
        } finally {
            setIsUseList(false);
        }
    };


    if (!isOpenMdl) return <></>

    return (
        <div className={`${style.container} ${isOpenModal ? style.open : ''}`}>
            <div
                onClick={renameList}
                className={style.content}>
                <EditOutlined style={{ fontSize: 20 }} />
                <text>Rename</text>
            </div>
            <div
                onClick={deleteList}
                className={style.content}>
                <DeleteOutlined style={{ color: '#FF2D20', fontSize: 20 }} />
                <text style={{ color: '#FF2D20' }}>Delete</text>
            </div>
        </div>
    );
};

export default ListMenu;
