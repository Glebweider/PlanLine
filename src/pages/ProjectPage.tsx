import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import style from '../styles/pages/ProjectPage.module.scss';
import Navbar from '../components/Navbar';
import { RootState } from '../redux/store';
import { useAlert } from '../components/Alert/context';
import { setProject } from '../redux/reducers/projectReducer';

const ProjectPage = () => {
	const { id } = useParams();
	const { showAlert } = useAlert();
	const dispatch = useDispatch();

	const projectState = useSelector((state: RootState) => state.projectReducer);

	useEffect(() => {
		// if (projectState.id == id) {
		// 		getPreviewProjects();
		// }
		getProject();           
	}, []);

	const getProject = async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URI}/projects/${id}`,
				{
					method: 'GET',
					credentials: 'include',
				}
			);

			if (!response.ok) {
				const errorText = await response.text();
				showAlert(`Server error: ${response.status}, ${errorText}`);
			}

			const project = await response.json();

			dispatch(setProject(project));
		} catch (error) {
			showAlert(`Fetch failed: ${error}`);
		}
	};

	return (
		<div className={style.container}>
			<Navbar />
		</div>
	);
};

export default ProjectPage;
