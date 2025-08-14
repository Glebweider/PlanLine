import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useState, useEffect, useRef } from 'react';
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

    const menuRef = useRef<HTMLDivElement>(null);


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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenModal(false);
            }
        };

        if (isOpenModal) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpenModal, setOpenModal]);

    const renameList = () => {
        setIsRenameList(true);
        setOpenModal(false);


        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.select();
            }
        }, 0);
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


    if (!isOpenMdl) return null;
    return (
        <div
            ref={menuRef}
            className={`${style.container} ${isOpenModal ? style.open : ''}`}>
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
