import { useDrag } from 'react-dnd';

import style from './TaskCard.module.scss';
import { ICard, IProject } from "../../../redux/reducers/projectReducer";
import { Avatar } from '../../../components/Avatar';
import formatDateLong from 'src/utils/FormatDateLong';
import formatDateShort from 'src/utils/FormatDateShort';


interface TaskCardProps {
    task: ICard;
    listId: string;
    projectState: IProject;
    setIsOpenTask: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedTask: React.Dispatch<React.SetStateAction<ICard>>;
}

const TaskCard: React.FC<TaskCardProps> = ({
    task,
    listId,
    projectState,
    setIsOpenTask,
    setSelectedTask,
}) => {
    const [{ isDragging }, dragRef] = useDrag({
        type: 'TASK',
        item: () => ({ task, listId }),
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
            <text className={style.title}>{task.title}</text>
            <div className={style.content}>
                <text className={`${style.dueDate} ${task.dueDate ? '' : style.disable}`}>
                    {task.dueDate ? formatDateShort(task.dueDate) : 'no date set'}
                    </text>
                <div className={style.users}>
                    {task.members.length > 3 &&
                        <span>+{task.members.length - 3}</span>
                    }

                    <div className={style.avatars}>
                        {task.members.slice(0, 3).map(member => (
                            <Avatar
                                key={member}
                                size={22}
                                className={style.user}
                                user={projectState.members.find((m) => m.id === member)}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <hr />
            <text className={style.createDate}>Created on {formatDateLong(task.createdAt)}</text>
        </div >
    );
};

export default TaskCard;
