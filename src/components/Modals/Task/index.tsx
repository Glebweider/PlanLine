import { SetStateAction, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ClockCircleOutlined, InfoCircleOutlined, MinusOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import style from './TaskModal.module.scss';
import { useAlert } from '../../Alert/context';
import { EMemberRole, ICard, IProject, removeCardFromList, updateCardInList } from '../../../redux/reducers/projectReducer';
import { Avatar } from '../../../components/Avatar';
import formatDateShortEn from '../../../utils/FormatDateShortEn';
import Tooltip from '../../../components/Tooltip';
import NewMemberMenu from 'src/components/Menus/NewMember';


interface TaskModalProps {
    isOpenModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    task: ICard;
    boardId: string;
    listId: string;
    project: IProject;
    userRole: EMemberRole;
}

const TaskModal: React.FC<TaskModalProps> = ({
    isOpenModal,
    setOpenModal,
    task,
    boardId,
    listId,
    project,
    userRole
}) => {
    const { showAlert } = useAlert();
    const dispatch = useDispatch();

    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isUpdatingTask, setIsUpdatingTask] = useState<boolean>(false);
    const [isOpenNewMembersMenu, setIsOpenNewMembersMenu] = useState<boolean>(false);
    const [newTaskDescription, setNewTaskDescription] = useState<string>('');
    const [newTaskName, setNewTaskName] = useState<string>('');
    const [newDueDate, setNewDueDate] = useState<Date>(new Date());


    useEffect(() => {
        if (newTaskDescription != task.description || newTaskName != task.title) {
            setNewTaskDescription(task.description);
            setNewTaskName(task.title);
        }
    }, [task]);

    const handleSaveTask = async () => {
        if (isUpdatingTask) return;

        setIsUpdatingTask(true);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/${project.id}/boards/${boardId}/${listId}/${task.id}`,
                {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: newTaskName || undefined,
                        description: newTaskDescription || undefined,
                        dueDate: newDueDate ?? undefined
                    }),
                }
            );

            if (!response.ok) {
                const data = await response.json();
                showAlert(`Server error: ${response.status}, ${data.message}`);
                return;
            }

            dispatch(updateCardInList({
                boardId: boardId,
                listId: listId,
                cardId: task.id,
                updates: {
                    title: newTaskName || undefined,
                    description: newTaskDescription || undefined,
                    dueDate: newDueDate ?? undefined
                }
            }));

            setOpenModal(false);
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
        } finally {
            setIsUpdatingTask(false);
        }
    }

    const handleDeleteTask = async () => {
        if (isUpdatingTask) return;

        setIsUpdatingTask(true);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/${project.id}/boards/${boardId}/${listId}/${task.id}`,
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

            dispatch(removeCardFromList({
                boardId: boardId,
                listId: listId,
                cardId: task.id
            }));

            setOpenModal(false);
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
        } finally {
            setIsUpdatingTask(false);
        }
    }

    const handleDeleteMemberTask = async (memberId: string) => {
        console.log(123)
    }

    if (!isOpenModal) return null;

    return (
        <div
            className='modalOverlay'
            onClick={() => {
                setOpenModal(false);
                setNewTaskDescription('');
                setIsEdit(false);
            }}>
            <div
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                className={style.modal}>
                <div className={style.content}>
                    <div className={style.header}>
                        {isEdit ?
                            <input
                                type="text"
                                placeholder="Enter task name"
                                value={newTaskName}
                                onChange={(e) => setNewTaskName(e.target.value)}
                                className={style.select} />
                            :
                            <text className={style.title}>{task.title}</text>
                        }
                        <div className={style.members}>
                            {task.members.slice(0, 4).map((member) =>
                                <div
                                    key={member}
                                    className={style.memberWrapper}>
                                    <Tooltip text="Участник задачи">
                                        <Avatar
                                            size={32}
                                            user={project.members.find((m) => m.id === member)}
                                            className={style.memberAvatar}
                                        />
                                    </Tooltip>
                                    {userRole === EMemberRole.ADMIN &&
                                        <button
                                            className={style.removeBtn}
                                            onClick={() => handleDeleteMemberTask(member)}>
                                            <MinusOutlined />
                                        </button>
                                    }
                                </div>
                            )}

                            {userRole === EMemberRole.ADMIN &&
                                task.members.length < 4 && (
                                    <div style={{ position: 'relative', display: 'flex' }}>
                                        <Tooltip text="Добавить участника в задачу">
                                            <div
                                                className={style.addMember}
                                                onClick={() => setIsOpenNewMembersMenu(!isOpenNewMembersMenu)}>
                                                <PlusOutlined />
                                            </div>
                                        </Tooltip>
                                        <NewMemberMenu
                                            user={undefined}
                                            isOpenModal={isOpenNewMembersMenu}
                                            setOpenModal={setIsOpenNewMembersMenu}
                                            project={project} />
                                    </div>
                                )
                            }
                        </div>
                    </div>

                    <hr className={style.hr} />
                    <div className={style.dates}>
                        {task.dueDate &&
                            <Tooltip text="Дата окончания задачи">
                                <div className={style.projectDataContainer}>
                                    <ClockCircleOutlined style={{ fontSize: 14 }} />
                                    <text className={style.projectDataText}>{formatDateShortEn(`${task.dueDate}`)}</text>
                                </div>
                            </Tooltip>
                        }
                        <Tooltip text="Дата созданния задачи">
                            <div className={style.projectDataContainer}>
                                <QuestionCircleOutlined style={{ fontSize: 14 }} />
                                <text className={style.projectDataText}>{formatDateShortEn(`${task.createdAt}`)}</text>
                            </div>
                        </Tooltip>
                        <Tooltip text="Дата обновленния задачи">
                            <div className={style.projectDataContainer}>
                                <InfoCircleOutlined style={{ fontSize: 14 }} />
                                <text className={style.projectDataText}>{formatDateShortEn(`${task.updatedAt}`)}</text>
                            </div>
                        </Tooltip>
                    </div>
                    <div className={style.description}>
                        <text>Description</text>
                        <textarea
                            value={newTaskDescription}
                            disabled={!isEdit}
                            onChange={(e) => setNewTaskDescription(e.target.value)}
                            maxLength={512}
                            className={style.textarea} />
                    </div>
                    <div className={style.buttons}>
                        <button
                            onClick={() => setIsEdit(!isEdit)}>
                            Редактировать
                        </button>
                        {isEdit ?
                            <button
                                style={{ backgroundColor: '#4285f4' }}
                                onClick={handleSaveTask}>
                                Сохранить
                            </button>
                            :
                            <button
                                style={{ backgroundColor: '#d9363e', }}
                                onClick={handleDeleteTask}>
                                Удалить
                            </button>
                        }
                    </div>
                </div>
                <div className={style.comments}>
                    Expect the release!
                </div>
            </div>
        </div >
    );
};

export default TaskModal;
