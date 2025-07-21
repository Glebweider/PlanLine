import { Link, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';

import style from '../styles/pages/ProjectPage.module.scss';
import Navbar from '../components/Navbar';
import { RootState } from '../redux/store';
import { useAlert } from '../components/Alert/context';
import { setProject } from '../redux/reducers/projectReducer';
import BoardItem from '../components/Board';
import textAreaHandleInput from '../utils/TextAreaFunc';

const ProjectPage = () => {
	const { projectId } = useParams();
	const { showAlert } = useAlert();
	const dispatch = useDispatch();

	const projectState = useSelector((state: RootState) => state.projectReducer);

	const [isCreateBoard, setCreateBoard] = useState<boolean>(false);
	const [isCreating, setIsCreating] = useState<boolean>(false);

	const textareaRef = useRef<HTMLTextAreaElement>(null);

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

	const createBoard = async () => {
		if (isCreating) return;

		const boardName = textareaRef.current?.value?.trim() || '';

		if (boardName.length < 1 || boardName.length > 256) {
			showAlert('Название должно быть от 1 до 256 символов.');
			return;
		}

		const unsafePattern = /<[^>]*>|script|onerror|onload|javascript:/i;
		if (unsafePattern.test(boardName)) {
			showAlert('Название не должно содержать HTML или потенциально опасный код.');
			return;
		}

		try {
			setIsCreating(true);
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URI}/projects/${projectId}/boards`,
				{
					method: 'POST',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ name: boardName })
				}
			);

			const data = await response.json();

			if (!response.ok) {
				showAlert(`Server error: ${response.status}, ${data.message}`);
				return;
			}

			dispatch(setProject({
				...projectState, boards: [...projectState.boards, data]
			}));
			if (textareaRef.current) {
				textareaRef.current.value = '';
			}
		} catch (error) {
			showAlert(`Fetch failed: ${error}`);
		} finally {
			setIsCreating(false);
		}
	};

	useEffect(() => {
		if (isCreateBoard) {
			textareaRef.current?.focus();
		}
	}, [isCreateBoard]);

	return (
		<div className={style.container}>
			<Navbar />
			<div className={style.boardsContainer}>
				{projectState.boards.map(board => (
					<BoardItem projectId={projectId} board={board} />
				))}
				{isCreateBoard ?
					<div className={style.createNewBoardContainer}>
						<textarea
							ref={textareaRef}
							placeholder="Введите название доски"
							className={style.inputField}
							rows={1}
							onInput={textAreaHandleInput}
							maxLength={256}/>
						<div className={style.createNewBoardButtons}>
							<div onClick={() => createBoard()} className={style.createNewBoardButtonApply}>
								Add board
							</div>
							<CloseOutlined
								onClick={() => setCreateBoard(false)}  
								className={style.createNewBoardButtonClose} />
						</div>
					</div>
					:
					<div onClick={() => setCreateBoard(true)} className={style.createBoardContainer}>
						<PlusOutlined style={{ marginLeft: 10, marginRight: 10}} />
						<text>Create board's</text>
					</div>
				}
			</div>
		</div>
	);
};

export default ProjectPage;
