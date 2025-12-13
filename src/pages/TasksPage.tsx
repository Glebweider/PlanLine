import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import style from '../styles/pages/TasksPage.module.scss';
import { useGetTasksByProjectId } from '../utils/fetch/getTasksByProjectId';
import TaskCard from '../components/Cards/Task';


export interface ITaskPreview {
	id: string;
	title: string;
	dueDate: string;
	boardId: string;
	boardName: string;
	createdAt: string;
	updatedAt: string;
}

const TasksPage = () => {
	const [searchParams] = useSearchParams();
	const { getTasksByProjectId } = useGetTasksByProjectId();

	const projectId = searchParams.get('projectId');
	const [tasks, setTasks] = useState<ITaskPreview[]>([]);

	useEffect(() => {
		if (projectId) {
			const fetchTasks = async () => {
				const tasks = await getTasksByProjectId(projectId);
				setTasks(tasks);
			};

			fetchTasks();
		}
	}, [projectId]);

	return (
		<div className={style.container}>
			{Object.entries(
				tasks.reduce<Record<string, typeof tasks>>((acc, task) => {
					if (!acc[task.boardName]) acc[task.boardName] = [];
					acc[task.boardName].push(task);
					return acc;
				}, {})
			).map(([boardName, boardTasks]) => (
				<div key={boardName} className={style.boardContainer}>
					<div className={style.boardTitle}>{boardName}</div>
					{boardTasks.map(task => (
						//<TaskCard key={task.id} projectId={projectId || ''} task={task} />
						<></>
					))}
				</div>
			))}
		</div>
	);
};

export default TasksPage;
