import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import style from '../styles/pages/ProjectsPage.module.scss';
import { useAlert } from '../components/Alert/context';
import ProjectCard from '../components/Cards/Project';
import { RootState } from '../redux/store';
import { useGetProject } from '../utils/fetch/getProjectById';
import BoardList from '../components/BoardList';
import CreateNewModal from '../components/Modals/CreateNew';
import { sseCore } from '../utils/sseCore';
import { EMemberRole, setProjectId } from '../redux/reducers/projectReducer';
import CreateNewTask from '../components/Modals/CreateNewTask';

export interface IBoardPreviewCard {
	id: string;
	name: string;
}

export interface IProjectPreviewCard {
	id: string;
	name: string;
	ownerId: string;
	boards: IBoardPreviewCard[]
}

const ProjectsPage = () => {
	const location = useLocation();
	const { showAlert } = useAlert();
	const { getProject } = useGetProject();
	const dispatch = useDispatch();

	const userState = useSelector((state: RootState) => state.userReducer);
	const projectState = useSelector((state: RootState) => state.projectReducer);

	const [projects, setProjects] = useState<IProjectPreviewCard[]>([]);
	const [selectedListId, setSelectedListId] = useState<string>('');
	const [isOpenModalCreateProject, setOpenModalCreateProject] = useState<boolean>(false);
	const [isOpenModalCreateBoard, setOpenModalCreateBoard] = useState<boolean>(false);
	const [isOpenModalCreateList, setOpenModalCreateList] = useState<boolean>(false);
	const [isOpenModalCreateTask, setOpenModalCreateTask] = useState<boolean>(false);
	const searchParams = new URLSearchParams(location.search);

	const projectId = searchParams.get('projectId');
	const boardId = searchParams.get('boardId');

	useEffect(() => {
		if (projects.length == 0) {
			getProjects();
		}
	}, []);

	useEffect(() => {
		if (!projectState.id || projectState.id != projectId || !projectState.name) {
			dispatch(setProjectId({ id: projectId || "" }));
			getProject(projectId || "");
		}
	}, [boardId]);

	useEffect(() => {
		const unsubscribe = sseCore.subscribe((event) => {
			if (event.entity === "board" && event.type === "create") {
				const newBoard = { id: event.payload.id, name: event.payload.name };

				setProjects(prev =>
					prev.map(project =>
						project.id === projectState.id
							? { ...project, boards: [...project.boards, newBoard] }
							: project
					)
				);
			}
		});

		return unsubscribe;
	}, [projectState.id]);

	const getProjects = async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URI}/projects/preview`,
				{
					method: 'GET',
					credentials: 'include',
				}
			);

			const data = await response.json();

			if (!response.ok) {
				showAlert(`Server error: ${response.status}, ${data.message}`);
				return;
			}

			setProjects(data);
		} catch (error) {
			showAlert(`Fetch failed: ${error}`);
		}
	};

	return (
		<div className={style.container}>
			{projects.length == 0 ?
				<div className={style.containerNewProject}>
					<div className={style.containerHeader}>
						<text className={style.textHeader}>Create your first project</text>
						<text className={style.textDescription}>or get invite at another projects</text>
					</div>
					<div
						onClick={() => setOpenModalCreateProject(true)}
						className={style.buttonAdd}>
						<div className={style.containerAdd}>
							<img src='./icons/Add.svg' />
						</div>
					</div>
				</div>
				:
				<div style={{ display: 'flex', marginTop: 67, height: '100%' }}>
					<div className={style.containerProjects}>
						{projects.map(project => (
							<ProjectCard
								key={project.id}
								project={project}
								setProjects={setProjects}
								setOpenModalCreateBoard={setOpenModalCreateBoard} />
						))}
						{projects?.length < 12 &&
							<div
								onClick={() => setOpenModalCreateProject(true)}
								className={style.containerAddProject}>
								<svg width="8" height="8" viewBox="0 0 8 8" fill="none">
									<rect x="3" width="2" height="8" rx="1" fill="#D4D4D4" />
									<rect x="8" y="3" width="2" height="8" rx="1" transform="rotate(90 8 3)" fill="#D4D4D4" />
								</svg>
								{/* SVG - Copy Paste, TODO: Move to SVG File */}
								<span>Add project</span>
							</div>
						}
					</div>
					{projectState && boardId &&
						<div className={style.contentProject}>
							{projectState?.boards
								?.find(board => board.id === boardId)?.lists.map(list => (
									<BoardList
										key={list.id}
										list={list}
										boardId={boardId} 
										userState={userState}
										projectState={projectState}
										setProjects={setProjects}
										setSelectedListId={setSelectedListId}
										setOpenModalCreateTask={setOpenModalCreateTask} />
								))}
							{projectState.boards
								?.find(board => board.id === boardId)?.members
								?.find(member => member.id === userState.id)?.role != EMemberRole.OBSERVER
								&& projectState?.boards?.length < 12 &&
								<div
									onClick={() => setOpenModalCreateList(true)}
									className={style.addListToBoard}>
									<div className={style.containerAddListToBoard}>
										<svg width="26" height="26" viewBox="0 0 26 26" fill="none">
											<rect x="10" width="6" height="26" rx="2" fill="#222225" />
											<rect x="26" y="10" width="6" height="26" rx="2" transform="rotate(90 26 10)" fill="#222225" />
										</svg>
										{/* SVG - Copy Paste, TODO: Move to SVG File */}
									</div>
								</div>
							}
						</div>
					}
				</div>
			}

			{/* Create Project Modal */}
			<CreateNewModal
				isOpen={isOpenModalCreateProject}
				onClose={() => setOpenModalCreateProject(!isOpenModalCreateProject)}
				title={'Project name:'}
				maxLength={16}
				onSubmit={async (name) => {
					const response = await fetch(
						`${process.env.REACT_APP_BACKEND_URI}/projects/`,
						{
							method: 'POST',
							credentials: 'include',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
								name: name,
							})
						}
					);

					const data = await response.json();

					if (!response.ok) {
						showAlert(`Server error: ${response.status}, ${data.message}`);
						return;
					}

					setProjects(prevProjects => [...prevProjects, {
						id: data.id,
						name: data.name,
						ownerId: data.ownerId,
						boards: data.boards
					}]);
				}} />

			{/* Create Board Modal */}
			<CreateNewModal
				isOpen={isOpenModalCreateBoard}
				onClose={() => setOpenModalCreateBoard(!isOpenModalCreateBoard)}
				title={'Board name:'}
				maxLength={16}
				onSubmit={async (name) => {
					const response = await fetch(
						`${process.env.REACT_APP_BACKEND_URI}/projects/${projectId}/boards`,
						{
							method: 'POST',
							credentials: 'include',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
								name: name,
							})
						}
					);


					if (!response.ok) {
						const data = await response.json();
						showAlert(`Server error: ${response.status}, ${data.message}`);
						return;
					}
				}} />

			{/* Create List Modal */}
			<CreateNewModal
				isOpen={isOpenModalCreateList}
				onClose={() => setOpenModalCreateList(!isOpenModalCreateList)}
				title={'List name:'}
				maxLength={16}
				onSubmit={async (name) => {
					const response = await fetch(
						`${process.env.REACT_APP_BACKEND_URI}/projects/${projectId}/boards/${boardId}`,
						{
							method: 'POST',
							credentials: 'include',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
								name: name,
							})
						}
					);

					if (!response.ok) {
						const data = await response.json();
						showAlert(`Server error: ${response.status}, ${data.message}`);
						return;
					}
				}} />

			{/* Create Task Modal */}
			<CreateNewTask
				isOpen={isOpenModalCreateTask}
				onClose={() => setOpenModalCreateTask(!isOpenModalCreateTask)}
				projectId={projectId || ''}
				boardId={boardId || ''}
				listId={selectedListId} />
		</div>
	);
};

export default ProjectsPage;
