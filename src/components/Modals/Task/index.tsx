import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ClockCircleOutlined, InfoCircleOutlined, MinusOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import style from './TaskModal.module.scss';
import { useAlert } from '../../Alert/context';
import { EMemberRole, IProject, IUserProject } from '../../../redux/reducers/projectReducer';
import { Avatar } from '../../../components/Avatar';
import formatDateShortEn from '../../../utils/FormatDateShortEn';
import Tooltip from '../../../components/Tooltip';
import NewMemberMenu from '../../../components/Menus/NewMember';
import { RootState } from '../../../redux/store';


interface TaskModalProps {
    isOpenModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    taskId: string;
    boardId: string;
    listId: string;
    project: IProject;
    userRole: EMemberRole;
    users: IUserProject[];
}

const TaskModal: React.FC<TaskModalProps> = ({
    isOpenModal,
    setOpenModal,
    taskId,
    boardId,
    listId,
    project,
    userRole,
    users
}) => {
    const { showAlert } = useAlert();

    const task = useSelector((state: RootState) =>
        state.projectReducer.boards
            .find(b => b.id === boardId)
            ?.lists.find(l => l.id === listId)
            ?.cards.find(c => c.id === taskId)
    );

    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isUpdatingTask, setIsUpdatingTask] = useState<boolean>(false);
    const [isOpenNewMembersMenu, setIsOpenNewMembersMenu] = useState<boolean>(false);
    const [newTaskDescription, setNewTaskDescription] = useState<string>('');
    const [newTaskName, setNewTaskName] = useState<string>('');
    const [newDueDate, setNewDueDate] = useState<Date>(new Date());


    useEffect(() => {
        if (newTaskDescription != task?.description || newTaskName != task.title) {
            setNewTaskDescription(task?.description || '');
            setNewTaskName(task?.title || '');
        }
    }, [task, isOpenModal]);

    const handleSaveTask = async () => {
        if (isUpdatingTask) return;

        setIsUpdatingTask(true);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/${project.id}/boards/${boardId}/${listId}/${task?.id}`,
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
                `${process.env.REACT_APP_BACKEND_URI}/projects/${project.id}/boards/${boardId}/${listId}/${task?.id}`,
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

            setOpenModal(false);
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
        } finally {
            setIsUpdatingTask(false);
        }
    }

    const handleDeleteMemberTask = async (memberId: string) => {
        if (isUpdatingTask) return;

        setIsUpdatingTask(true);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/${project.id}/boards/${boardId}/${listId}/${taskId}/remove-member/${memberId}`,
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
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
        } finally {
            setIsUpdatingTask(false);
        }
    }

    if (!task) return null;
    if (!isOpenModal) return null;

    return (
        <div
            className='modalOverlay'
            onClick={() => {
                setOpenModal(false);
                setNewTaskDescription('');
                setIsEdit(false);
                setIsOpenNewMembersMenu(false);
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

                            {userRole === EMemberRole.ADMIN && users.filter(user => !task.members.includes(user.id)).length > 0 &&
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
                                            isOpenModal={isOpenNewMembersMenu}
                                            setOpenModal={setIsOpenNewMembersMenu}
                                            users={users}
                                            members={task.members}
                                            projectId={project.id}
                                            boardId={boardId}
                                            listId={listId}
                                            taskId={task.id} />
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
