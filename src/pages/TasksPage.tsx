import { useEffect, useState } from 'react';

import style from '../styles/pages/TasksPage.module.scss';
import styleUser from '../components/Users/Users.module.scss';
import { useGetMyTasks } from '../utils/fetch/getTasksByProjectId';
import { formatDateShort, formatDateLong } from '../utils';
import { Avatar } from '../components/Avatar';
import { TASK_MEMBER_VISIBILITY } from '../utils/constants';


export interface IUserTask {
	id: string;
	title: string;
	dueDate: Date | null;
	members: {
		id: string;
		username: string;
		avatar?: string;
	}[];
	createdAt: Date;
	projectId: string;
	projectName: string;
	boardId: string;
	boardName: string;
}

const TasksPage = () => {
	const { getMyTasks } = useGetMyTasks();
	const [tasks, setTasks] = useState<IUserTask[]>([]);

	useEffect(() => {
		const fetchTasks = async () => {
			const tasks = await getMyTasks();
			setTasks(tasks);
		};
		fetchTasks();
	}, []);

	const groupedTasks = tasks.reduce<Record<string, IUserTask[]>>((acc, task) => {
		const key = `${task.projectName} / ${task.boardName}`;
		if (!acc[key]) acc[key] = [];
		acc[key].push(task);
		return acc;
	}, {});

	return (
		<div className={style.container}>
			{Object.entries(groupedTasks).map(([boardKey, boardTasks]) => (
				<div key={boardKey} className={style.boardSection}>
					<div className={style.boardHeader}>{boardKey}</div>
					<div className={style.tasks}>
						{boardTasks.map(task => (
							<div key={task.id} className={style.taskCard}>
								<div className={style.title}>{task.title}</div>
								<div className={style.content}>
									<span className={`${style.dueDate} ${task.dueDate ? '' : style.disable}`}>
										{task.dueDate ? formatDateShort(task.dueDate) : 'no date set'}
									</span>
									<div className={styleUser.users}>
										{task.members.length > TASK_MEMBER_VISIBILITY && (
											<span>+{task.members.length - TASK_MEMBER_VISIBILITY}</span>
										)}
										<div className={styleUser.avatars}>
											{task.members.slice(0, TASK_MEMBER_VISIBILITY).map(member => (
												<Avatar
													key={member.id}
													size={22}
													className={styleUser.user}
													user={member}
												/>
											))}
										</div>
									</div>
								</div>
								<div className={style.createDate}>Created on {formatDateLong(task.createdAt)}</div>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
};

export default TasksPage;
