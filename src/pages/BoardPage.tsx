// MainView.jsx
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';

import style from '../styles/pages/BoardPage.module.scss';
import Navbar from '../components/Navbar';
import { setProject } from '../redux/reducers/projectReducer';
import { useAlert } from '../components/Alert/context';
import { RootState } from '../redux/store';
import textAreaHandleInput from 'src/utils/TextAreaFunc';


const BoardPage = () => {
	const { projectId, boardId } = useParams();
	const { showAlert } = useAlert();
	const dispatch = useDispatch();

	const boardState = useSelector((state: RootState) => state.projectReducer.boards.find(b => b.id === boardId));

	const [isCreateList, setCreateList] = useState<boolean>(false);
	const [isCreating, setIsCreating] = useState<boolean>(false);

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (!boardState) {
			getProject();  
		}  
	}, [boardId]);

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

	const createList = async () => {
		console.log(3)
	};

	return (
		<div className={style.container}>
			<Navbar />
			<div className={style.listsContainer}>
				{boardState?.lists.map(list => (
					<div key={list.id} className={style.listContainer}>

					</div>
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
