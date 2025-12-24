import { useEffect, useState } from 'react';

import style from './TaskFormModal.module.scss';
import { useAlert } from '../../Alert/context';
import CreateNewTaskUsers from '../CreateNewTaskUsers';
import CreateNewTaskDate from '../CreateNewTaskDate';
import Editor from '../../Editor';
import { TASK_DESCRIPTION_MAX_LENGTH, TASK_TITLE_MAX_LENGTH, TASK_TITLE_MIN_LENGTH } from '../../../utils/constants';


interface TaskFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    boardId: string;
    listId: string;
    initialData?: InitialTaskData;
}

interface InitialTaskData {
    id?: string;
    name?: string;
    description?: string;
    users?: string[];
    date?: Date | null;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({
    isOpen,
    onClose,
    projectId,
    boardId,
    listId,
    initialData
}) => {
    const { showAlert } = useAlert();

    const [name, setName] = useState(initialData?.name ?? '');
    const [description, setDescription] = useState(initialData?.description ?? '');
    const [users, setUsers] = useState<string[]>(initialData?.users ?? []);
    const [date, setDate] = useState<Date | null>(initialData?.date ? new Date(initialData.date) : null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isOpenUsersMenu, setIsOpenUsersMenu] = useState<boolean>(false);
    const [isOpenDateMenu, setIsOpenDateMenu] = useState<boolean>(false);

    useEffect(() => {
        if (!isOpen) return;

        setName(initialData?.name ?? '');
        setDescription(initialData?.description ?? '');
        setUsers(initialData?.users ?? []);
        setDate(initialData?.date ?? null);
    }, [isOpen, initialData]);

    const onSave = async () => {
        if (name.length > TASK_TITLE_MAX_LENGTH && name.length != TASK_TITLE_MIN_LENGTH) {
            showAlert(`Task name must be no more than ${TASK_TITLE_MAX_LENGTH} characters`);
            return;
        }

        if (description.length > TASK_DESCRIPTION_MAX_LENGTH) {
            showAlert(`Task description must be no more than ${TASK_DESCRIPTION_MAX_LENGTH} characters`);
            return;
        }

        if (isLoading) return;
        setIsLoading(true);

        try {
            const isEditMode = initialData?.id ? true : false;

            const url = `${process.env.REACT_APP_BACKEND_URI}/projects/${projectId}/boards/${boardId}/${listId}`;
            const method = isEditMode ? 'PUT' : 'POST';

            const bodyData: any = {
                title: name.length === 0 ? 'New task' : name,
                ...(description && { description }),
                ...(users?.length > 0 && { assignedUsers: users }),
                ...(date && { dueDate: date })
            };

            const response = await fetch(
                isEditMode ? `${url}/${initialData?.id}` : url,
                {
                    method,
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bodyData)
                }
            );

            if (!response.ok) {
                const data = await response.json();
                showAlert(`Server error: ${response.status}, ${data.message}`);
                return;
            }

            setName('');
            setDescription('');
            setDate(null);
            setUsers([]);
            onClose();
        } catch (error) {
            showAlert(`Error: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return <></>;

    return (
        <>
            <div className="modalOverlay" onClick={() => { onClose(); }}>
                <div
                    className={style.modalContent}
                    onClick={(e) => e.stopPropagation()}>
                    <div className={style.modalContentContainer}>
                        <div className={style.modalHeader}>
                            <div style={{ display: 'flex', maxHeight: 60 }}>
                                <img src="./icons/Ellipse.svg" />
                                <div className={style.modalData}>
                                    <div className={style.modalInputFieldContainer}>
                                        <input
                                            type="text"
                                            placeholder="Enter task name"
                                            value={name}
                                            maxLength={TASK_TITLE_MAX_LENGTH}
                                            onChange={(e) => setName(e.target.value)}
                                            className={style.inputField} />
                                    </div>
                                    <hr />
                                </div>
                            </div>
                            <div className={style.rightModalData}>
                                <img onClick={() => setIsOpenUsersMenu(true)} src='./icons/Profile-User.svg' />
                                <img onClick={() => setIsOpenDateMenu(true)} src='./icons/Calendar.svg' />
                            </div>
                        </div>
                        <text className={style.description}>Description</text>
                        <Editor
                            description={description}
                            setDescription={setDescription}
                            onClose={onClose}
                            onCreate={onSave} />
                    </div>
                </div>
            </div>
            <CreateNewTaskUsers
                isOpen={isOpenUsersMenu}
                onClose={() => setIsOpenUsersMenu(false)}
                boardId={boardId}
                selectedUsers={users}
                setSelectedUsers={setUsers} />

            <CreateNewTaskDate
                isOpen={isOpenDateMenu}
                onClose={() => setIsOpenDateMenu(false)}
                selectedDate={date}
                setSelectedDate={setDate} />
        </>
    )
};

export default TaskFormModal;
