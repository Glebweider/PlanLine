// MainView.jsx
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
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
import NavbarCard from '../Cards/Navbar';
import NavbarProjectCard from '../Cards/NavbarProject';
import ButtonCreate from '../ButtonCreate';


export interface IPreviewProject {
    id: string;
    name: string;
    icon: string;
    cardsCount: number;
    ownerId: string;
}

const Navbar = () => {
    const { projectId } = useParams();
    const location = useLocation();
    const currentPath = location.pathname;

    const { showAlert } = useAlert();
    const user = useSelector((state: RootState) => state.userReducer);

    const [isOpenModalNewProject, setOpenModalNewProject] = useState<boolean>(false);
    const [isOpenNavbar, setOpenNavbar] = useState<boolean>(false);
    const [isOpenUserModal, setOpenUserModal] = useState<boolean>(false);
    const [projects, setProjects] = useState<IPreviewProject[]>([]);
    const [ownerProjects, setOwnerProjects] = useState<number>(0);
    const [hideText, setHideText] = useState(false);


    useEffect(() => {
        if (isOpenNavbar) {

            const timeout = setTimeout(() => setHideText(true), 300);
            return () => clearTimeout(timeout);
        } else {
            setHideText(false);
        }
    }, [isOpenNavbar]);

    useEffect(() => {
        if (projects.length == 0) {
            getPreviewProjects();
        }
    }, []);

    useEffect(() => {
        const count = projects.filter(project => project.ownerId === user.id).length;
        setOwnerProjects(count);
    }, [projects, user.id]);

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


    return (
        <>
            <div className={`${style.container} ${isOpenNavbar ? style.containerCollapsed : ''}`}>
                <div
                    onClick={() => isOpenNavbar ? setOpenNavbar(false) : setOpenUserModal(true)}
                    className={isOpenNavbar ? style.navbarDisable : style.userContainer}>
                    <Avatar size={64} />
                    {!isOpenNavbar &&
                        <>
                            <div className={style.userContent}>
                                <a>{user.username}</a>
                                {/* <text>Online</text> */}
                            </div>
                            <DoubleLeftOutlined
                                onClick={() => setOpenNavbar(true)}
                                className={style.changeVisibility} />
                        </>
                    }
                </div>

                <div style={{ width: '100%', height: '100%', marginTop: 34 }}>
                    <NavbarCard
                        href={'dashboard'}
                        Icon={<AppstoreOutlined style={{ fontSize: 30 }} />}
                        title={!isOpenNavbar ? 'Dashboard' : ''}
                        currentPath={currentPath} />
                    <NavbarCard
                        href={'tasks'}
                        Icon={<CheckCircleOutlined style={{ fontSize: 28 }} />}
                        title={!isOpenNavbar ? 'Tasks' : ''}
                        currentPath={currentPath} />

                    {projects.length > 0 &&
                        <>
                            {!isOpenNavbar && <hr className={style.line} />}
                            <NavbarCard
                                href={'projects'}
                                Icon={<EllipsisOutlined style={{ fontSize: 30 }} />}
                                title={!isOpenNavbar ? 'All Projects' : ''}
                                currentPath={currentPath} />

                            {!isOpenNavbar && projects.map(project => (
                                <NavbarProjectCard
                                    key={project.id}
                                    title={project.name}
                                    href={project.id}
                                    taskCounter={project.cardsCount} />
                            ))}
                        </>
                    }

                    {projectId &&
                        <>
                            {!isOpenNavbar && <hr className={style.line} />}
                            <NavbarCard
                                href={`project/${projectId}/users`}
                                Icon={<TeamOutlined style={{ fontSize: 26 }} />}
                                title={!isOpenNavbar ? 'All Users' : ''}
                                currentPath={currentPath} />
                            {projects.find(project => project.id === projectId)?.ownerId === user.id &&
                                <NavbarCard
                                    href={`project/${projectId}/settings`}
                                    Icon={<SettingOutlined style={{ fontSize: 24 }} />}
                                    title={!isOpenNavbar ? 'Settings' : ''}
                                    currentPath={currentPath} />
                            }
                        </>
                    }
                </div>

                {ownerProjects < 5 &&
                    <ButtonCreate style={style.buttonCreateProject} setIsOpenCreateBoardModal={setOpenModalNewProject} />
                }
            </div>
            <NewProjectModal
                setProjects={setProjects}
                isOpenModal={isOpenModalNewProject}
                setOpenModal={setOpenModalNewProject} />
        </>
    );
};

export default Navbar;
