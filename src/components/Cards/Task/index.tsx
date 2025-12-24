import { useDrag } from 'react-dnd';

import style from './TaskCard.module.scss';
import Users from '../../../components/Users';
import { ICard, IProject } from "../../../redux/reducers/projectReducer";
import { formatDateLong, formatDateShort } from '../../../utils';

interface TaskCardProps {
    task: ICard;
    listId: string;
    projectState: IProject;
    setIsOpenTask: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOpenEditTask: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedTask: React.Dispatch<React.SetStateAction<ICard>>;
    userPermission: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
    task,
    listId,
    projectState,
    setIsOpenTask,
    setIsOpenEditTask,
    setSelectedTask,
    userPermission
}) => {
    const [{ isDragging }, dragRef] = useDrag({
        type: 'TASK',
        item: () => ({ task, listId }),
        canDrag: () => userPermission,
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    }, [task, listId]);

    return (
        <div
            ref={dragRef}
            onClick={() => {
                setSelectedTask(task);
                setIsOpenTask(true);
            }}
            className={style.container} >
            <div className={style.contentHeader}>
                <text className={style.title}>{task.title}</text>
                {userPermission &&
                    <div
                        className={style.edit}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedTask(task);
                            setIsOpenEditTask(true);
                        }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M14.6666 4.33325H10.6666" stroke="#303037" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M4.00004 4.33325H1.33337" stroke="#303037" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M6.66671 6.66667C7.95537 6.66667 9.00004 5.622 9.00004 4.33333C9.00004 3.04467 7.95537 2 6.66671 2C5.37804 2 4.33337 3.04467 4.33337 4.33333C4.33337 5.622 5.37804 6.66667 6.66671 6.66667Z" stroke="#303037" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M14.6667 11.6667H12" stroke="#303037" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M5.33337 11.6667H1.33337" stroke="#303037" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M9.33333 13.9999C10.622 13.9999 11.6667 12.9552 11.6667 11.6666C11.6667 10.3779 10.622 9.33325 9.33333 9.33325C8.04467 9.33325 7 10.3779 7 11.6666C7 12.9552 8.04467 13.9999 9.33333 13.9999Z" stroke="#303037" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                }
            </div>
            <div className={style.content}>
                <text className={`${style.dueDate} ${task.dueDate ? '' : style.disable}`}>
                    {task.dueDate ? formatDateShort(task.dueDate) : 'no date set'}
                </text>
                <Users task={task} projectState={projectState} />
            </div>
            <hr />
            <text className={style.createDate}>Created on {formatDateLong(task.createdAt)}</text>
        </div>
    );
};

export default TaskCard;
