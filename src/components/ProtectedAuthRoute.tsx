/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/reducers/userReducer';
import { RootState } from '../redux/store';
import { useAlert } from './Alert/context';
import style from '../styles/pages/ProtectedAuthRoute.module.scss';
import { useNavigate } from 'react-router-dom';

type ProtectedRouteProps = {
	children: React.ReactNode;
};

const ProtectedAuthRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isAuth } = useSelector((state: RootState) => state.userReducer);
	const { showAlert } = useAlert();

	useEffect(() => {
		checkAuth();
	}, []);

	const checkAuth = async () => {
		if (isAuth) {
			setIsAuthenticated(true);
			return;
		}

		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URI}/auth/`,
				{
					credentials: 'include',
				}
			);
			
			if (response.ok) {
				const data = await response.json();
				dispatch(
					setUser({
						id: data.discordId,
						username: data.username,
						avatar: data.avatar,
						projects: data.projects,
						isAuth: true,
					})
				);
				setIsAuthenticated(true);
			} else {
				setIsAuthenticated(false);
				navigate('/auth');
			}
		} catch (error) {
			showAlert(`Ошибка при проверке токена: ${error}`);
			setIsAuthenticated(false);
			navigate('/auth');
		}
    };

	if (isAuthenticated === null) {
		return (
			<div className={style.container}>
				<div className={style.content}>
					<text style={{ marginTop: 25 }} >Ожидайте загрузки</text>
					<video 
						src='/video/asmr-loading.mp4'
						autoPlay
						loop
						muted
						playsInline
						style={{ width: '90%', height: '75%', objectFit: 'cover', margin: 25, borderRadius: 15 }} />
				</div>
			</div>
		);
	}

	return isAuthenticated ? <>{children}</> : <div></div>;
};

export default ProtectedAuthRoute;