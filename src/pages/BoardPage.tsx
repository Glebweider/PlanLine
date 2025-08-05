import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import style from '../styles/pages/BoardPage.module.scss';
import { RootState } from '../redux/store';
import { useGetProject } from '../utils/fetch/getProjectById';
import ButtonCreate from '../components/ButtonCreate';
import NewBoardModal from '../components/Modals/NewBoard';


const BoardPage = () => {
	const { projectId, boardId } = useParams();
	const { getProject } = useGetProject();

	const projectState = useSelector((state: RootState) => state.projectReducer);
	const board = projectState.boards.find(board => board.id === boardId);

	const [isOpenCreateListModal, setIsOpenCreateListModal] = useState<boolean>(false);


	useEffect(() => {
		if (!projectState.id || projectState.id != projectId) {
			getProject(projectId || "");
		}
	}, [projectId]);

	return (
		<div className={style.container}>
			{/* {board?.lists.map(board =>
				 <BoardList key={board.id} board={board}  />
			)} */}
			<ButtonCreate setIsOpenCreateBoardModal={setIsOpenCreateListModal} />
			<NewBoardModal
				isOpenModal={isOpenCreateListModal}
				setOpenModal={setIsOpenCreateListModal}
				projectId={projectId || ""} />
		</div>
	);
};

export default BoardPage;
