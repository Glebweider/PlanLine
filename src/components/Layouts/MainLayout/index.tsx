import { Outlet, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import style from './MainLayout.module.scss';
import Navbar from '../../Navbar';
import { RootState } from '../../../redux/store';
import AllUsersLayout from '../AllUsers';
import ProjectDropdown from './ProjectDropdown';


const MainLayout = () => {
    const projectState = useSelector((state: RootState) => state.projectReducer);

    const [namePage, setNamePage] = useState<string>('');
    const params = useParams();

    const getPageName = (pathname: string) => {
        if (pathname.startsWith('/dashboard')) return 'Dashboard';
        if (pathname.startsWith('/tasks')) return 'Tasks';
        if (pathname.startsWith('/projects')) return 'Projects';
        if (pathname.includes('/settings')) return 'Project > Settings';
        if (pathname.includes('/users')) return 'Project > All Users';
        if (pathname.match(/\/project\/[^/]+\/[^/]+/)) {
            return params.boardId && projectState.boards.find(board => board.id === params.boardId) ?
                `Board ${projectState.boards.find(board => board.id === params.boardId)?.name}` : 'Board';
        }
        if (pathname.match(/\/project\/[^/]+$/)) {
            return params.projectId ? `Project ${projectState.name}` : 'Project';
        }
        return 'Unknown';
    };

    useEffect(() => {
        setNamePage(getPageName(location.pathname));
    }, [params, projectState]);

    return (
        <div className={style.container}>
            <Navbar />
            <div className={style.content}>
                <div className={style.header}>
                    <text className={style.title}>
                        {namePage}
                        {namePage === 'Tasks' && <> {'>'}<ProjectDropdown /></>}
                    </text>
                    {location.pathname.includes('/users') &&
                        <AllUsersLayout />
                    }
                </div>
                <hr className={style.hr} />
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
