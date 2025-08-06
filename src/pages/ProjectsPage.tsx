import { useEffect, useState } from 'react';
import style from '../styles/pages/ProjectsPage.module.scss';
import { useAlert } from 'src/components/Alert/context';
import ProjectCard from 'src/components/Cards/Project';

export interface IProjectCard {
	id: string;
	name: string;
	icon: string;
	ownerId: string;
	dateOfCreation: string;
	membersCount: number;
	boardsCount: number;
	cardsCount: number;
}

const ProjectsPage = () => {
	const { showAlert } = useAlert();
	const [projects, setProjects] = useState<IProjectCard[]>([]);

	useEffect(() => {
		if (projects.length == 0) {
			getProjects();
		}
	}, []);

	const getProjects = async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URI}/projects/`,
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
			{projects.map(project =>
				<ProjectCard 
					key={project.id} 
					project={project}
					setProjects={setProjects} />
			)}
		</div>
	);
};

export default ProjectsPage;
