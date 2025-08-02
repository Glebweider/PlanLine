import { useState } from 'react';
import { useSelector } from 'react-redux';

import style from './ProjectMenu.module.scss';
import { useAlert } from '../Alert/context';
import { RootState } from '../../redux/store';
import { LogoutOutlined, TeamOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';


interface ProjectMenuProps {
    isOpenModal: boolean;
    projectOwnerId: string;
    projectId: string;
}

const ProjectMenu: React.FC<ProjectMenuProps> = ({ isOpenModal, projectOwnerId, projectId }) => {
    const userId = useSelector((state: RootState) => state.userReducer.id);


    const leaveProject = async () => {

        // TODO Додепать
        console.log('Leave Porject')
    };

    return (
        <div className={`${style.container} ${isOpenModal ? style.open : ''}`}>
            <Link
                to={`/project/${projectId}/users`}
                className={style.content}>
                <TeamOutlined style={{ fontSize: 20 }} />
                <text>All Users</text>
            </Link>
            {projectOwnerId == userId &&
                <div
                    onClick={leaveProject}
                    className={style.content}>
                    <LogoutOutlined style={{ color: '#FF2D20', fontSize: 18 }} />
                    <text style={{ color: '#FF2D20' }}>Leave</text>
                </div>
            }
        </div>
    );
};

export default ProjectMenu;
