import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


import style from '../styles/pages/ProjectPage.module.scss';
import { RootState } from '../redux/store';
import BoardCard from '../components/Board';
import NewBoardModal from '../components/Modals/NewBoard';
import { useGetProject } from '../utils/fetch/getProjectById';
import ButtonCreate from '../components/ButtonCreate';

const ProjectPage = () => {
	const { projectId } = useParams();
	const { getProject } = useGetProject();

	const projectState = useSelector((state: RootState) => state.projectReducer);
	const userId = useSelector((state: RootState) => state.userReducer).id;

	const [isOpenCreateBoardModal, setIsOpenCreateBoardModal] = useState<boolean>(false);


	useEffect(() => {
		if (!projectState.id || projectState.id != projectId) {
			getProject(projectId || "");
		}
	}, [projectId]);

	return (
		<div className={style.container}>
			{projectState.boards.map(board =>
				<BoardCard
					key={board.id}
					projectId={projectId || ""}
					board={board} />
			)}
			{projectState.ownerId === userId &&
				<ButtonCreate setIsOpenCreateBoardModal={setIsOpenCreateBoardModal} />
			}
			<NewBoardModal
				isOpenModal={isOpenCreateBoardModal}
				setOpenModal={setIsOpenCreateBoardModal}
				projectId={projectId || ""} />
		</div>
	);
};

export default ProjectPage;
