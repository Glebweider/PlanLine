// MainView.jsx
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
    AppstoreOutlined,
    CheckCircleOutlined,
    EllipsisOutlined,
    SettingOutlined,
    TeamOutlined
} from '@ant-design/icons';

import style from './Navbar.module.scss';
import { Avatar } from '../Avatar';
import { RootState } from '../../redux/store';
import { useAlert } from '../Alert/context';
import NewProjectModal from '../NewProjectModal';
import NavbarCard from '../NavbarCard';
import NavbarProjectCard from '../NavbarProjectCard';


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
    const [isOpenUserModal, setOpenUserModal] = useState<boolean>(false);
    const [projects, setProjects] = useState<IPreviewProject[]>([]);

    useEffect(() => {
        if (projects.length == 0) {
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

    return (
        <>
            <div className={style.container}>
                <div
                    onClick={() => setOpenUserModal(!isOpenUserModal)}
                    className={style.userContainer}>
                    <Avatar size={48} />
                    <div className={style.userContent}>
                        <a>{user.username}</a>
                        {/* <text>Online</text> */}
                    </div>
                </div>

                <div style={{ width: '100%', height: '100%', marginTop: 34 }}>
                    <NavbarCard
                        href={'dashboard'}
                        Icon={<AppstoreOutlined style={{ fontSize: 30 }} />}
                        title={'Dashboard'} 
                        currentPath={currentPath} />
                    <NavbarCard
                        href={'tasks'}
                        Icon={<CheckCircleOutlined style={{ fontSize: 28 }} />}
                        title={'Tasks'} 
                        currentPath={currentPath} />

                    {projects.length > 0 &&
                        <>
                            <hr className={style.line} />
                            <NavbarCard
                                href={'projects'}
                                Icon={<EllipsisOutlined style={{ fontSize: 30 }} />}
                                title={'All Projects'} 
                                currentPath={currentPath} />

                            {projects.map(project => (
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
                            <hr className={style.line} />
                            <NavbarCard
                                href={`project/${projectId}/users`}
                                Icon={<TeamOutlined style={{ fontSize: 26 }} />}
                                title={'All Users'} 
                                currentPath={currentPath} />
                            <NavbarCard
                                href={`project/${projectId}/settings`}
                                Icon={<SettingOutlined style={{ fontSize: 24 }} />}
                                title={'Settings'} 
                                currentPath={currentPath} />
                        </>
                    }
                </div>

                {projects.length < 5 &&
                    <div
                        onClick={() => setOpenModalNewProject(true)}
                        className={style.createNewProjectButton}>
                        New Project
                    </div>
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
