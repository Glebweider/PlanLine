import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState, MouseEvent } from 'react';
import {
    AppstoreOutlined,
    CheckCircleOutlined,
    DoubleLeftOutlined,
    EllipsisOutlined,
    SettingOutlined,
    TeamOutlined
} from '@ant-design/icons';

import style from './Navbar.module.scss';
import { Avatar } from '../Avatar';
import { RootState } from '../../redux/store';
import { useAlert } from '../Alert/context';
import NewProjectModal from '../Modals/NewProject';
import NavbarCard from '../Cards/NavbarCard';
import NavbarProjectCard from '../Cards/NavbarProjectCard';
import ButtonCreate from '../ButtonCreate';

export interface IPreviewProject {
    id: string;
    name: string;
    icon: string;
    cardsCount: number;
}

const Navbar = () => {
    const { projectId } = useParams();
    const location = useLocation();
    const currentPath = location.pathname;

    const { showAlert } = useAlert();
    const user = useSelector((state: RootState) => state.userReducer);

    const [isOpenModalNewProject, setOpenModalNewProject] = useState<boolean>(false);
    const [isOpenNavbar, setOpenNavbar] = useState<boolean>(false);
    const [projects, setProjects] = useState<IPreviewProject[]>([]);

    useEffect(() => {
        if (projects.length === 0) {
            getPreviewProjects();
        }
    }, []);

    const getPreviewProjects = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/preview`,
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

            if (Array.isArray(data)) {
                setProjects(data);
            } else {
                showAlert(`Unexpected response format ${data}`);
            }
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
        }
    };

    const handleContainerClick = (e: MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        // Если клик был по кнопке, ссылке, иконке или input/textarea — не сворачиваем
        if (
            target.closest('button') ||
            target.closest('a') ||
            target.closest('input') ||
            target.closest('textarea') ||
            target.closest('svg') ||
            target.closest(`.${style.buttonCreateProject}`)
        ) {
            return;
        }
        setOpenNavbar(prev => !prev);
    };

    return (
        <>
            <div
                className={`${style.container} ${isOpenNavbar ? style.containerCollapsed : ''}`}
                onClick={handleContainerClick}
            >
                <div
                    className={isOpenNavbar ? style.userContainerCollapsed : style.userContainer}
                >
                    <Avatar size={64} />
                    {!isOpenNavbar && (
                        <>
                            <div className={style.userContent}>
                                <span>{user.username}</span>
                            </div>
                        </>
                    )}
                </div>

                <div style={{ width: '100%', height: '100%', marginTop: 34 }}>
                    <NavbarCard
                        href={'dashboard'}
                        Icon={<AppstoreOutlined style={{ fontSize: 30 }} />}
                        title={!isOpenNavbar ? 'Dashboard' : ''}
                        currentPath={currentPath} 
                    />
                    <NavbarCard
                        href={'tasks'}
                        Icon={<CheckCircleOutlined style={{ fontSize: 28 }} />}
                        title={!isOpenNavbar ? 'Tasks' : ''}
                        currentPath={currentPath} 
                    />

                    {projects.length > 0 && (
                        <>
                            {!isOpenNavbar && <hr className={style.line} />}
                            <NavbarCard
                                href={'projects'}
                                Icon={<EllipsisOutlined style={{ fontSize: 30 }} />}
                                title={!isOpenNavbar ? 'All Projects' : ''}
                                currentPath={currentPath} 
                            />

                            {!isOpenNavbar && projects.map(project => (
                                <NavbarProjectCard
                                    key={project.id}
                                    title={project.name}
                                    href={project.id}
                                    taskCounter={project.cardsCount} 
                                />
                            ))}
                        </>
                    )}

                    {projectId && (
                        <>
                            {!isOpenNavbar && <hr className={style.line} />}
                            <NavbarCard
                                href={`project/${projectId}/users`}
                                Icon={<TeamOutlined style={{ fontSize: 26 }} />}
                                title={!isOpenNavbar ? 'All Users' : ''}
                                currentPath={currentPath} 
                            />
                            <NavbarCard
                                href={`project/${projectId}/settings`}
                                Icon={<SettingOutlined style={{ fontSize: 24 }} />}
                                title={!isOpenNavbar ? 'Settings' : ''}
                                currentPath={currentPath} 
                            />
                        </>
                    )}
                </div>

                {projects.length > 0 && (
                    <ButtonCreate 
                        style={style.buttonCreateProject} 
                        setIsOpenCreateBoardModal={setOpenModalNewProject} 
                    />
                )}
            </div>
            <NewProjectModal
                setProjects={setProjects}
                isOpenModal={isOpenModalNewProject}
                setOpenModal={setOpenModalNewProject} 
            />
        </>
    );
};

export default Navbar;
