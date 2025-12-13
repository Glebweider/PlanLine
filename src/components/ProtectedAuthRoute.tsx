/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/reducers/userReducer';
import { RootState } from '../redux/store';
import { useAlert } from './Alert/context';
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
				navigate('/');
			}
		} catch (error) {
			showAlert(`Ошибка при проверке токена: ${error}`);
			setIsAuthenticated(false);
			navigate('/');
		}
    };

	if (isAuthenticated === null) {
		return (<></>);
	}

	return isAuthenticated ? <>{children}</> : <div></div>;
};

export default ProtectedAuthRoute;