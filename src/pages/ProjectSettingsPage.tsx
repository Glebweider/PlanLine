import { useParams } from 'react-router-dom';

import { useAlert } from '../components/Alert/context';
import style from '../styles/pages/ProjectSettingsPage.module.scss';


const ProjectSettingsPage = () => {
	const { projectId } = useParams();
	const { showAlert } = useAlert();


	const handleDiscordInvite = async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URI}/projects/${projectId}/integration/discord`,
				{
					method: 'GET',
					credentials: 'include',
				}
			);

			if (!response.ok) {
				const data = await response.json();
				showAlert(`Server error: ${response.status}, ${data.message}`);
				return;
			}

			const inviteLink = await response.text();
			window.open(inviteLink, '_blank');
		} catch (error) {
			showAlert(`Fetch failed: ${error}`);
		}
	};

	return (
		<div className={style.container}>
			<button onClick={handleDiscordInvite}>Пригласить бота в Discord</button>
		</div>
	);
};

export default ProjectSettingsPage;
