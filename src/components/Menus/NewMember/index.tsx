import { useEffect, useRef, useState } from 'react';

import style from './NewMember.module.scss';
import { useAlert } from '../../Alert/context';
import { IUserProject } from '../../../redux/reducers/projectReducer';
import { Avatar } from '../../../components/Avatar';


interface NewMemberProps {
    isOpenModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    users: IUserProject[];
    members: string[];
    projectId: string;
    boardId: string;
    listId: string;
    taskId: string;
}

const NewMemberMenu: React.FC<NewMemberProps> = ({
    isOpenModal,
    setOpenModal,
    users,
    members,
    projectId,
    boardId,
    listId,
    taskId
}) => {
    const { showAlert } = useAlert();

    const [isOpenMdl, setIsOpenMdl] = useState<boolean>(false);
    const [isUpdatingTask, setIsUpdatingTask] = useState<boolean>(false);

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
            if (!isOpenModal && menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenModal(false);
            }
        };

        if (isOpenModal)
            document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpenModal, isOpenModal, setOpenModal]);

    const addUser = async (userId: string) => {
        if (isUpdatingTask) return;

        setIsUpdatingTask(true);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/${projectId}/boards/${boardId}/${listId}/${taskId}/add-member/${userId}`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                }
            );

            if (!response.ok) {
                const data = await response.json();
                showAlert(`Server error: ${response.status}, ${data.message}`);
                return;
            }

            setOpenModal(false);
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
        } finally {
            setIsUpdatingTask(false);
        }
    }

    if (!isOpenMdl) return null;

    return (
        <div
            ref={menuRef}
            className={`${style.container} ${isOpenModal ? style.open : ''}`}>
            {users.filter(user => !members.includes(user.id)).map(user =>
                <div
                    onClick={() => addUser(user.id)}
                    className={style.content}>
                    <Avatar size={30} user={user} />
                    <text>{user.displayName ? user.displayName : user.name}</text>
                </div>
            )}
        </div>
    );
}

export default NewMemberMenu;