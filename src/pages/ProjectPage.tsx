import { useParams } from 'react-router-dom';
import { SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';


import style from '../styles/pages/ProjectPage.module.scss';
import { RootState } from '../redux/store';
import BoardCard from '../components/Board';
import NewBoardModal from '../components/Modals/NewBoard';
import { useGetProject } from '../utils/fetch/getProjectById';
import ButtonCreate from 'src/components/ButtonCreate';

const ProjectPage = () => {
	const { projectId } = useParams();
	const { getProject } = useGetProject();

	const projectState = useSelector((state: RootState) => state.projectReducer);

	const [isOpenCreateBoardModal, setIsOpenCreateBoardModal] = useState<boolean>(false);


	useEffect(() => {
		getProject(projectId || "");
	}, [projectId]);

	return (
		<div className={style.container}>
			{projectState.boards.map(board =>
				<BoardCard
					key={board.id}
					projectId={projectId || ""}
					board={board} />
			)}
			<ButtonCreate setIsOpenCreateBoardModal={setIsOpenCreateBoardModal} />
			<NewBoardModal 
				isOpenModal={isOpenCreateBoardModal} 
				setOpenModal={setIsOpenCreateBoardModal} 
				projectId={projectId || ""} />
		</div>
	);
};

export default ProjectPage;
