import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import style from '../styles/pages/AllUsersProjectPage.module.scss';
import { useAlert } from '../components/Alert/context';
import UserCard from '../components/UserCard';
import { RootState } from '../redux/store';


export interface IUserProject {
	id: string;
	name: string;
	avatar: string;
	dateOfCreation: string;
}

const AllUsersProjectPage = () => {
	const { projectId } = useParams();
	const { showAlert } = useAlert();

	const projectState = useSelector((state: RootState) => state.projectReducer);

	const [users, setUsers] = useState<IUserProject[]>([]);

	useEffect(() => {
		getUsersProject();
	}, [projectId]);

	useEffect(() => {
		if (Array.isArray(projectState.members)) {
			const convertedUsers: IUserProject[] = projectState.members.map(user => ({
				...user,
				dateOfCreation: new Date().toISOString(),
			}));

			setUsers(convertedUsers);
		}
	}, [projectState.members]);

	const getUsersProject = async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URI}/projects/${projectId}/users`,
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

			setUsers(data);
		} catch (error) {
			showAlert(`Fetch failed: ${error}`);
		}
	};

	return (
		<div className={style.container}>
			<text style={{ fontSize: 22, marginBottom: 5 }}>Owner</text>
			<UserCard user={users.find(user => user.id == projectState.ownerId)} />
			{users.filter(user => user.id !== projectState.ownerId).length > 0 &&
				<>
					<text style={{ fontSize: 22, marginTop: 25 }}>
						Users: {users.filter(user => user.id !== projectState.ownerId).length}
					</text>
					<div className={style.content}>
						{users
							.filter(user => user.id !== projectState.ownerId)
							.map(user => (
								<UserCard key={user.id} user={user} />
							))
						}
					</div>
				</>
			}
		</div>
	);
};

export default AllUsersProjectPage;
