import { Link } from "react-router-dom";
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, QuestionCircleOutlined, WarningOutlined } from "@ant-design/icons";

import style from './TaskCard.module.scss';
import { ITaskPreview } from "../../../pages/TasksPage";
import formatDateShortEn from "../../../utils/FormatDateShortEn";
import Tooltip from "../../../components/Tooltip";


interface TaskCardProps {
    projectId: string;
    task: ITaskPreview;
}

const TaskCard: React.FC<TaskCardProps> = ({ projectId, task }) => {
    const getDueIcon = (dueDate: string | null) => {
        if (!dueDate) {
            console.log(dueDate)
            return <QuestionCircleOutlined className={style.icon} style={{ color: "#000" }} />;
        }

        const due = new Date(dueDate);
        const now = new Date();

        const isPast = due.getTime() < now.getTime();
        const isSoon = due.getTime() - now.getTime() <= 1000 * 60 * 60 * 24 * 2;

        if (isPast) {
            return <CloseCircleOutlined className={style.icon} style={{ color: "#FF2D20" }} />;
        } else if (isSoon) {
            return <WarningOutlined className={style.icon} style={{ color: "#FFA500" }} />;
        } else {
            return <ClockCircleOutlined className={style.icon} style={{ color: "#ccc" }} />;
        }
    };

    return (
        <Link
            to={`/project/${projectId}/${task.boardId}`}
            className={style.taskItem}>

            {getDueIcon(task.dueDate)}
            <div className={style.taskInfo}>
                <div className={style.title}>{task.title}</div>
                <div className={style.timestamps}>
                    <Tooltip text="Дата окончания задачи">
                        <div className={style.projectDataContainer}>
                            <CheckCircleOutlined style={{ fontSize: 14 }} />
                            <text className={style.projectDataText}>{formatDateShortEn(task.dueDate)}</text>
                        </div>
                    </Tooltip>
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
            </div>
        </Link>
    );
};

export default TaskCard;
