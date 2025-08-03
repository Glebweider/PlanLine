// MainView.jsx
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';

import style from '../styles/pages/BoardPage.module.scss';
import { setProject } from '../redux/reducers/projectReducer';
import { useAlert } from '../components/Alert/context';
import { RootState } from '../redux/store';
import textAreaHandleInput from '../utils/TextAreaFunc';
import ListItem from '../components/List';
import { useGetProject } from '../utils/fetch/getProjectById';


const BoardPage = () => {
	const { projectId, boardId } = useParams();
	const { showAlert } = useAlert();
	const { getProject } = useGetProject();
	const dispatch = useDispatch();

	const projectState = useSelector((state: RootState) => state.projectReducer);
	const boardState = projectState.boards.find(b => b.id === boardId);

	const [isCreateList, setCreateList] = useState<boolean>(false);
	const [isCreatingList, setIsCreatingList] = useState<boolean>(false);

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (!boardState) {
			getProject(projectId || "");  
		}  
	}, [boardId]);

	const createList = async () => {
		if (isCreatingList) return;

		const listName = textareaRef.current?.value?.trim() || '';

		if (listName.length < 1 || listName.length > 512) {
			showAlert('Название должно быть от 1 до 512 символов.');
			return;
		}

		const unsafePattern = /<[^>]*>|script|onerror|onload|javascript:/i;
		if (unsafePattern.test(listName)) {
			showAlert('Название не должно содержать HTML или потенциально опасный код.');
			return;
		}

		try {
			setIsCreatingList(true);
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URI}/projects/${projectId}/boards/${boardId}`,
				{
					method: 'POST',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ name: listName })
				}
			);

			const data = await response.json();

			if (!response.ok) {
				showAlert(`Server error: ${response.status}, ${data.message}`);
				return;
			}


			dispatch(setProject({
			...projectState,
			boards: projectState.boards.map(board =>
				board.id === boardId
				? { ...board, lists: [...board.lists, data] }
				: board
			)
			}));
			
			if (textareaRef.current) 
				textareaRef.current.value = '';
			
		} catch (error) {
			showAlert(`Fetch failed: ${error}`);
		} finally {
			setIsCreatingList(false);
		}
	};

	return (
		<div className={style.container}>
			
			<div className={style.listsContainer}>
				{boardState?.lists.map(list => (
					<ListItem 
						key={list.id}
						list={list} 
						projectId={projectId} 
						boardId={boardId} />
				))}
				{isCreateList ?
					<div className={style.createNewListContainer}>
						<textarea
							ref={textareaRef}
							placeholder="Введите название списка"
							className={style.inputField}
							rows={1}
							onInput={textAreaHandleInput}
							maxLength={256}/>
						<div className={style.createNewListButtons}>
							<div onClick={() => createList()} className={style.createNewListButtonApply}>
								Add List
							</div>
							<CloseOutlined
								onClick={() => setCreateList(false)}  
								className={style.createNewListButtonClose} />
						</div>
					</div>
					:
					<div onClick={() => setCreateList(true)} className={style.createListContainer}>
						<PlusOutlined style={{ marginLeft: 10, marginRight: 10}} />
						<text>Create list's</text>
					</div>
				}
			</div>
		</div>
	);
};

export default BoardPage;
