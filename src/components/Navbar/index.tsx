// MainView.jsx
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import style from './Navbar.module.scss';
import { Avatar } from '../Avatar';
import { RootState } from '../../redux/store';
import { useAlert } from '../Alert/context';
import UserMenu from '../UserMenu';

export interface IPreviewProject {
    id: string;
    name: string;
    icon: string;
    cardsCount: string;
}

const Navbar = () => {
    const { projectId } = useParams();
    const { showAlert } = useAlert();
    const user = useSelector((state: RootState) => state.userReducer);

    const [isOpenNavbar, setOpenNavbar] = useState<boolean>(true);
    const [isOpenModalNewProject, setOpenModalNewProject] = useState<boolean>(false);
    const [isOpenUserModal, setOpenUserModal] = useState<boolean>(false);
    const [isCreatingProject, setIsCreatingProject] = useState<boolean>(false);
    const [projects, setProjects] = useState<IPreviewProject[]>([]);
    const [newProjectName, setNewProjectName] = useState<string>('');

    useEffect(() => {
        if (projects.length == 0) {
            getPreviewProjects();
        }                  
    }, []);

    const getPreviewProjects = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/`,
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

    const createProject = async () => {
        if (newProjectName.length < 1) {
            showAlert('Project name must be at least 1 character');
            return;
        }
        if (newProjectName.length > 12) {
            showAlert('Project name must be no more than 12 characters');
            return;
        }

        if (isCreatingProject) return;

        setIsCreatingProject(true);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: newProjectName,
                        //icon: newProjectIcon
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                showAlert(`Server error: ${response.status}, ${data.message}`);
                return;
            }

            setProjects(prevProjects => [...prevProjects, data]);
            setNewProjectName('');
            setOpenModalNewProject(false);
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
        } finally {
            setIsCreatingProject(false);
        }
    };
    
	return (
        <div className={clsx(style.navbar, !isOpenNavbar && style.disable)}>
            <div className={style.container}>
                <div
                    onClick={() => setOpenUserModal(!isOpenUserModal)}
                    className={style.userContainer}>
                    <Avatar size={70} />
                    <div className={style.userContent}>
                        <a>{user.username}</a>
                        {/* <text>Online</text> */}
                    </div>
                </div>
                <UserMenu isOpen={isOpenUserModal} />
                <div className={style.boardsContainer}>
                    <a>Projects</a>
                    {projects && projects.map(project => (
                        <Link
                            key={project.id}
                            className={clsx(style.cardBoardContainer, projectId == project.id && style.cardBoardActive)}  
                            to={`/project/${project.id}`}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {project.icon ?
                                    <img 
                                        src={project.icon} 
                                        alt='icon'
                                        className={style.cardBoardIcon} />
                                    :
                                    <a className={style.cardBoardIcon}>{project.name.charAt(0)}</a>
                                }
                                <text className={style.cardBoardText}>{project.name}</text>
                            </div>
                            <text className={style.cardBoardTaskCounter}>{project.cardsCount}</text>
                        </Link>
                    ))}
                </div>
                {projects.length < 5 &&
                    <div 
                        onClick={() => setOpenModalNewProject(true)}
                        className={style.createNewProjectButton}>
                        New Project
                    </div>
                }
            </div>
            {isOpenNavbar ?
                <ArrowLeftOutlined 
                    onClick={() => setOpenNavbar(false)} 
                    className={style.changeVisibilityNavbarButton} />
                :
                <ArrowRightOutlined 
                    onClick={() => setOpenNavbar(true)} 
                    className={style.changeVisibilityNavbarButton} />
            }
            {isOpenModalNewProject && (
                <div className={style.modalOverlay}>
                    <div className={style.modalContent}>
                        <a style={{ color: '#fff', fontSize: 18}}>Create New Project</a>
                        <div className={style.modalData}>
                            <input
                                type="text"
                                placeholder="Enter project name"
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                className={style.inputField} />
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div 
                                onClick={() => !isCreatingProject && createProject()} 
                                className={style.createProjectButton}
                                style={{ opacity: isCreatingProject ? 0.5 : 1 }}>Create</div>
                            <div onClick={() => setOpenModalNewProject(false)} className={style.createProjectButton}>Close</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
	);
};

export default Navbar;
