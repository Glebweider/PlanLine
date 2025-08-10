import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

import style from './NewMember.module.scss';
import { useAlert } from '../../Alert/context';
import { addUserToCardInList, IUserProject } from '../../../redux/reducers/projectReducer';
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
    const dispatch = useDispatch();

    const [isOpenMdl, setIsOpenMdl] = useState<boolean>(false);
    const [isUpdatingTask, setIsUpdatingTask] = useState<boolean>(false);


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

    const addUser = async (userId: string) => {
        if (isUpdatingTask) return;

        setIsUpdatingTask(true);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/${projectId}/boards/${boardId}/${listId}/${taskId}`,
                {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        assignedUser: userId
                    }),
                }
            );

            if (!response.ok) {
                const data = await response.json();
                showAlert(`Server error: ${response.status}, ${data.message}`);
                return;
            }

            dispatch(addUserToCardInList({
                boardId: boardId,
                listId: listId,
                cardId: taskId,
                userId: userId
            }));

            setOpenModal(false);
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
        } finally {
            setIsUpdatingTask(false);
        }
    }

    if (!isOpenMdl) return <></>

    return (
        <div className={`${style.container} ${isOpenModal ? style.open : ''}`}>
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