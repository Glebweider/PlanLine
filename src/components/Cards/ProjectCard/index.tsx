import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    MoreOutlined,
    ProjectOutlined,
    ProfileOutlined,
    CalendarOutlined,
    TeamOutlined
} from '@ant-design/icons';


import style from './ProjectCard.module.scss';
import formatDateShortEn from '../../../utils/FormatDateShortEn';
import ProjectMenu from '../../Menus/Project';
import { IProjectCard } from '../../../pages/ProjectsPage';


interface ProjectCardProps {
    project: IProjectCard;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const [isOpenProjectMenu, setIsOpenProjectMenu] = useState<boolean>(false);

    return (
        <div style={{ position: 'relative', display: 'flex' }}>
            <Link
                to={`/project/${project.id}`}
                className={style.projectContainer}>
                <div className={style.projectHeader}>
                    <a>{project.name}</a>
                    <MoreOutlined
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsOpenProjectMenu(!isOpenProjectMenu);
                        }}
                        style={{ fontSize: 32, marginRight: -10 }} />
                </div>
                <div className={style.projectFooter}>
                    <div className={style.projectDataContainer}>
                        <ProjectOutlined style={{ fontSize: 14 }} />
                        <text className={style.projectDataText}>{project.boardsCount} Boards</text>
                    </div>
                    <div className={style.projectDataContainer}>
                        <ProfileOutlined style={{ fontSize: 14 }} />
                        <text className={style.projectDataText}>{project.cardsCount} Tasks</text>
                    </div>
                    <div className={style.projectDataContainer}>
                        <CalendarOutlined style={{ fontSize: 14 }} />
                        <text className={style.projectDataText}>{formatDateShortEn(project.dateOfCreation)}</text>
                    </div>
                    <div className={style.projectDataContainer}>
                        <TeamOutlined style={{ fontSize: 14 }} />
                        <text className={style.projectDataText}>{project.membersCount} Assigned</text>
                    </div>
                </div>
            </Link>
            <ProjectMenu
                isOpenModal={isOpenProjectMenu}
                projectOwnerId={project.ownerId}
                projectId={project.id} />
        </div>
    );
};

export default ProjectCard;
