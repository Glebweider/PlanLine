import { useSelector } from 'react-redux';
import { LogoutOutlined, SettingOutlined, TeamOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import style from './ProjectMenu.module.scss';
import { RootState } from '../../../redux/store';
import { useAlert } from '../../../components/Alert/context';
import { IProjectCard } from '../../../pages/ProjectsPage';


interface ProjectMenuProps {
    isOpenModal: boolean;
    projectOwnerId: string;
    projectId: string;
    setProjects: React.Dispatch<React.SetStateAction<IProjectCard[]>>;
}

const ProjectMenu: React.FC<ProjectMenuProps> = ({ isOpenModal, projectOwnerId, projectId, setProjects }) => {
    const { showAlert } = useAlert();

    const userId = useSelector((state: RootState) => state.userReducer.id);

    const [isOpenMdl, setIsOpenMdl] = useState<boolean>(false);
    const [isLeaveProject, setIsLeaveProject] = useState<boolean>(false);

    useEffect(() => {
        if (isOpenModal) {
            setIsOpenMdl(true);
        } else {
            const timer = setTimeout(() => {
                setIsOpenMdl(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isOpenModal]);


    const leaveProject = async () => {
        if (isLeaveProject) return;

        setIsLeaveProject(true);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/${projectId}/leave`,
                {
                    method: 'POST',
                    credentials: 'include',
                }
            );

            if (!response.ok) {
                const data = await response.json();
                showAlert(`Server error: ${response.status}, ${data.message}`);
                return;
            }

            setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
        } finally {
            setIsLeaveProject(false);
        }
    };


    if (!isOpenMdl) return <></>

    return (
        <div className={`${style.container} ${isOpenModal ? style.open : ''}`}>
            <Link
                to={`/project/${projectId}/users`}
                className={style.content}>
                <TeamOutlined style={{ fontSize: 20 }} />
                <text>All Users</text>
            </Link>
            {projectOwnerId == userId &&
                <Link
                    to={`/project/${projectId}/settings`}
                    className={style.content}>
                    <SettingOutlined style={{ fontSize: 20 }} />
                    <text>Settings</text>
                </Link>
            }
            {projectOwnerId != userId &&
                <div
                    onClick={leaveProject}
                    className={style.content}>
                    <LogoutOutlined style={{ color: '#FF2D20', fontSize: 20 }} />
                    <text style={{ color: '#FF2D20' }}>Leave</text>
                </div>
            }
        </div>
    );
};

export default ProjectMenu;
