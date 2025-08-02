import { useParams } from 'react-router-dom';
import { SetStateAction, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import style from '../styles/pages/ProjectPage.module.scss';
import { RootState } from '../redux/store';
import { useAlert } from '../components/Alert/context';
import { setProject } from '../redux/reducers/projectReducer';
import BoardCard from '../components/Board';
import { PlusOutlined } from '@ant-design/icons';
import NewBoardModal from 'src/components/Modals/NewBoard';

const ProjectPage = () => {
	const { projectId } = useParams();
	const { showAlert } = useAlert();
	const dispatch = useDispatch();

	const projectState = useSelector((state: RootState) => state.projectReducer);

	//const [isCreating, setIsCreating] = useState<boolean>(false);
	const [isOpenCreateBoardModal, setIsOpenCreateBoardModal] = useState<boolean>(false);

	useEffect(() => {
		getProject();
	}, [projectId]);

	const getProject = async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URI}/projects/${projectId}`,
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

			dispatch(setProject(data));
		} catch (error) {
			showAlert(`Fetch failed: ${error}`);
		}
	};

	// const createBoard = async () => {
	// 	if (isCreating) return;

	// 	const boardName = textareaRef.current?.value?.trim() || '';

	// 	if (boardName.length < 1 || boardName.length > 256) {
	// 		showAlert('Название должно быть от 1 до 256 символов.');
	// 		return;
	// 	}

	// 	const unsafePattern = /<[^>]*>|script|onerror|onload|javascript:/i;
	// 	if (unsafePattern.test(boardName)) {
	// 		showAlert('Название не должно содержать HTML или потенциально опасный код.');
	// 		return;
	// 	}

	// 	try {
	// 		setIsCreating(true);
	// 		const response = await fetch(
	// 			`${process.env.REACT_APP_BACKEND_URI}/projects/${projectId}/boards`,
	// 			{
	// 				method: 'POST',
	// 				credentials: 'include',
	// 				headers: {
	// 					'Content-Type': 'application/json'
	// 				},
	// 				body: JSON.stringify({ name: boardName })
	// 			}
	// 		);

	// 		const data = await response.json();

	// 		if (!response.ok) {
	// 			showAlert(`Server error: ${response.status}, ${data.message}`);
	// 			return;
	// 		}

	// 		dispatch(setProject({
	// 			...projectState, boards: [...projectState.boards, data]
	// 		}));
	// 		if (textareaRef.current) {
	// 			textareaRef.current.value = '';
	// 		}
	// 	} catch (error) {
	// 		showAlert(`Fetch failed: ${error}`);
	// 	} finally {
	// 		setIsCreating(false);
	// 	}
	// };

	return (
		<div className={style.container}>
			{projectState.boards.map(board =>
				<BoardCard
					key={board.id}
					projectId={projectId || ""}
					board={board} />
			)}
			<div
				onClick={() => setIsOpenCreateBoardModal(true)}
				className={style.addBoardContainer}>
				<PlusOutlined />
			</div>
			<NewBoardModal 
				isOpenModal={isOpenCreateBoardModal} 
				setOpenModal={setIsOpenCreateBoardModal} 
				projectId={projectId || ""} />
		</div>
	);
};

export default ProjectPage;
