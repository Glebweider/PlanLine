import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { useAlert } from '../components/Alert/context';
import styles from '../styles/pages/ProjectSettingsPage.module.scss';
import { RootState } from '../redux/store';
import formatDateShortEn from '../utils/FormatDateShortEn';
import { useGetProject } from '../utils/fetch/getProjectById';
import { clearProject, setProjectName, updateUpdateChannelId } from '../redux/reducers/projectReducer';


const ProjectSettingsPage = () => {
	const { projectId } = useParams();
	const { showAlert } = useAlert();
	const { getProject } = useGetProject();
	const dispatch = useDispatch();

	const projectState = useSelector((state: RootState) => state.projectReducer);

	const [name, setName] = useState<string>(projectState.name);
	const [updateChannelId, setUpdateChannelId] = useState<string>(projectState.discordIntegration.updateChannelId);


	useEffect(() => {
		if (!projectState.id) {
			getProject(projectId || "");
		}
	}, [projectId]);

	useEffect(() => {
		setName(projectState.name);
		setUpdateChannelId(projectState.discordIntegration?.updateChannelId || '');
	}, [projectState]);

	const handleNameSave = async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URI}/projects/${projectId}`,
				{
					method: "PUT",
					credentials: "include",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ name }),
				}
			);
			if (!response.ok) {
				const data = await response.json();
				showAlert(`Server error: ${response.status}, ${data.message}`);
				return;
			}
			dispatch(setProjectName(name));
		} catch (error) {
			showAlert(`Fetch failed: ${error}`);
		}
	};

	const handleDeleteProject = async () => {
		if (!window.confirm("Are you sure you want to delete this project?")) return;
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URI}/projects/${projectId}`,
				{
					method: "DELETE",
					credentials: "include",
				}
			);
			if (!response.ok) {
				const data = await response.json();
				showAlert(`Server error: ${response.status}, ${data.message}`);
				return;
			}
			dispatch(clearProject());
			window.location.href = "/projects";
		} catch (error) {
			showAlert(`Fetch failed: ${error}`);
		}
	};

	const handleUpdateChannelSave = async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URI}/projects/${projectId}/discord/update-channel`,
				{
					method: 'POST',
					credentials: 'include',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						updateChannelId: updateChannelId
					}),
				}
			);

			if (!response.ok) {
				const data = await response.json();
				showAlert(`Server error: ${response.status}, ${data.message}`);
				return;
			}

			dispatch(updateUpdateChannelId(updateChannelId));
		} catch (error) {
			showAlert(`Fetch failed: ${error}`);
		}
	};

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
		<div className={styles.container}>
			{/* Общие настройки */}
			<section className={styles.block}>
				<h2>General</h2>
				<label>
					Project name
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)} />
				</label>

				<div className={styles.row}>
					<div>
						<div className={styles.infoRow}>
							<span>ID:</span>
							<span className={styles.code}>{projectState.id}</span>
						</div>
						<div className={styles.meta}>
							Created at:{" "}
							{projectState.dateOfCreation &&
								formatDateShortEn(projectState.dateOfCreation.toString())}
						</div>
					</div>
					{name !== projectState.name && (
						<button className={styles.saveBtn} onClick={handleNameSave}>
							Save
						</button>
					)}
				</div>
			</section>

			{/* Discord интеграция */}
			<section className={styles.block}>
				<h2>Discord Integration</h2>
				{!projectState.discordId ? (
					<button className={styles.discordBtn} onClick={handleDiscordInvite}>
						Add Discord integration
					</button>
				) : (
					<>
						<label>
							Guild ID
							<input type="text" value={projectState.discordId} readOnly />
						</label>
						<div className={styles.row}>
							<label>
								Update channel ID
								<input
									type="text"
									value={updateChannelId}
									onChange={(e) => setUpdateChannelId(e.target.value)} />
							</label>
							{updateChannelId !==
								(projectState.discordIntegration?.updateChannelId || "") && (
									<button
										className={styles.saveBtn}
										onClick={handleUpdateChannelSave}>
										Save
									</button>
								)}
						</div>
					</>
				)}
			</section>

			{/* Опасная зона */}
			<section className={styles.block}>
				<h2>Danger Zone</h2>
				<button className={styles.dangerBtn} onClick={handleDeleteProject}>
					Delete Project
				</button>
			</section>
		</div>
	);
};

export default ProjectSettingsPage;
