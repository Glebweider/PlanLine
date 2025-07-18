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

export interface IPreviewProject {
    id: string;
    name: string;
    icon: string;
}

const Navbar = () => {
    const { id } = useParams();
    const { showAlert } = useAlert();
    const user = useSelector((state: RootState) => state.userReducer);

    const [isOpenNavbar, setOpenNavbar] = useState<boolean>(true);
    const [isOpenModalNewProject, setOpenModalNewProject] = useState<boolean>(false);
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

            if (!response.ok) {
                const errorText = await response.text();
                showAlert(`Server error: ${response.status}, ${errorText}`);
            }

            const projects = await response.json();

            if (Array.isArray(projects)) {
                setProjects(projects); 
            } else {
                showAlert(`Unexpected response format ${projects}`);
            }
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
        }
    };

    const createProject = async () => {
        setOpenModalNewProject(false)
    };
    
	return (
        <div className={clsx(style.navbar, !isOpenNavbar && style.disable)}>
            <div className={style.container}>
                <div className={style.userContainer}>
                    <Avatar size={70} />
                    <div className={style.userContent}>
                        <a>{user.username}</a>
                        {/* <text>Online</text> */}
                    </div>
                </div>
                <div className={style.boardsContainer}>
                    <a>Projects</a>
                    {projects && projects.map(project => (
                        <Link
                            key={project.id}
                            className={clsx(style.cardBoardContainer, id == project.id && style.cardBoardActive)}  
                            to={`/project/${project.id}`}>
                            {project.icon ?
                                <img 
                                    src={project.icon} 
                                    alt='icon'
                                    className={style.cardBoardIcon} />
                                :
                                <a className={style.cardBoardIcon}>{project.name.charAt(0)}</a>
                            }
                            <text className={style.cardBoardText}>{project.name}</text>
                        </Link>
                    ))}
                </div>
                <div 
                    onClick={() => setOpenModalNewProject(true)}
                    className={style.createNewProjectButton}>
                    New Project
                </div>
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
                            <div onClick={() => createProject()} className={style.createProjectButton}>Create</div>
                            <div onClick={() => setOpenModalNewProject(false)} className={style.createProjectButton}>Close</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
	);
};

export default Navbar;
