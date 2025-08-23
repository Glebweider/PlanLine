import { useState } from 'react';

import style from './NewTaskModal.module.scss';
import { useAlert } from '../../Alert/context';
import { IUserProject } from '../../../redux/reducers/projectReducer';


interface NewTaskModalProps {
    isOpenModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    projectId: string;
    boardId: string;
    listId: string;
    users: IUserProject[];
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpenModal, projectId, setOpenModal, boardId, listId, users }) => {
    const { showAlert } = useAlert();

    const [isCreatingTask, setIsCreatingTask] = useState<boolean>(false);
    const [newTaskName, setNewTaskName] = useState<string>('');
    const [newTaskDescription, setNewTaskDescription] = useState<string>('');
    const [assignedUser, setAssignedUser] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>('');


    const createTask = async () => {
        if (newTaskName.length < 1) {
            showAlert('Task name must be at least 1 character');
            return;
        }
        if (newTaskName.length > 32) {
            showAlert('Task name must be no more than 32 characters');
            return;
        }

        if (isCreatingTask) return;

        setIsCreatingTask(true);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/${projectId}/boards/${boardId}/${listId}`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: newTaskName,
                        ...(assignedUser && { assignedUser }),
                        ...(dueDate && { dueDate: new Date(dueDate).toISOString() }),
                        ...(newTaskDescription && { description: newTaskDescription })
                    })
                }
            );

            if (!response.ok) {
                const data = await response.json();
                showAlert(`Server error: ${response.status}, ${data.message}`);
                return;
            }

            setNewTaskName('');
            setNewTaskDescription('');
            setAssignedUser('');
            setDueDate('');
            setOpenModal(false);
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
        } finally {
            setIsCreatingTask(false);
        }
    };

    if (!isOpenModal) return null;

    return (
        <div
            onClick={() => {
                setOpenModal(false);
                setNewTaskName('');
                setNewTaskDescription('');
                setAssignedUser('');
                setDueDate('');
            }}
            className='modalOverlay'>
            <div
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                className={style.modal}>
                <h2 style={{ color: '#fff', fontSize: 26 }}>Create New Task</h2>

                <div className={style.userInfo}>
                    <text>Task Name</text>
                    <input
                        type="text"
                        placeholder="Enter task name"
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                        className={style.select} />
                </div>
                <div className={style.userInfo}>
                    <div className={style.userContent}>
                        <text>Description</text>
                        <span className={style.charCount}>{newTaskDescription.length}/512</span>
                    </div>
                    <textarea
                        placeholder="Enter task description"
                        value={newTaskDescription}
                        maxLength={512}
                        onChange={(e) => {
                            if (e.target.value.length <= 512) {
                                setNewTaskDescription(e.target.value);
                            }
                        }}
                        className={style.textarea} />
                </div>
                <div className={style.userInfo}>
                    <text>Assignee</text>
                    <select
                        value={assignedUser}
                        onChange={(e) => setAssignedUser(e.target.value)}
                        className={style.select}>
                        <option value="">Select a user</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                    </select>
                </div>
                <div className={style.userInfo}>
                    <label htmlFor="dueDate">Due Date</label>
                    <input
                        type="datetime-local"
                        id="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className={style.select} />
                </div>

                <hr className={style.hr} />
                <div
                    onClick={() => !isCreatingTask && createTask()}
                    className={style.saveButton}
                    style={{ opacity: isCreatingTask ? 0.5 : 1 }}>
                    Create
                </div>
            </div>
        </div>
    );
};

export default NewTaskModal;
