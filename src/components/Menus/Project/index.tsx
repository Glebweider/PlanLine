import { useSelector } from 'react-redux';
import { LogoutOutlined, SettingOutlined, TeamOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

import style from './ProjectMenu.module.scss';
import { RootState } from '../../../redux/store';

interface ProjectMenuProps {
    isOpenModal: boolean;
    onClose: () => void; 
    projectOwnerId: string;
    projectId: string;
}

const ProjectMenu: React.FC<ProjectMenuProps> = ({ isOpenModal, onClose, projectOwnerId, projectId }) => {
    const userId = useSelector((state: RootState) => state.userReducer.id);

    const [isOpenMdl, setIsOpenMdl] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpenModal) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpenModal, onClose]);

    const leaveProject = async () => {
        // TODO: реализовать логику выхода из проекта
        console.log('Leave Project');
    };

    if (!isOpenMdl) return null;

    return (
        <div ref={menuRef} className={`${style.container} ${isOpenModal ? style.open : ''}`}>
            <Link to={`/project/${projectId}/users`} className={style.content}>
                <TeamOutlined style={{ fontSize: 20 }} />
                <span>All Users</span>
            </Link>

            {projectOwnerId === userId && (
                <Link to={`/project/${projectId}/settings`} className={style.content}>
                    <SettingOutlined style={{ fontSize: 20 }} />
                    <span>Settings</span>
                </Link>
            )}

            {projectOwnerId !== userId && (
                <div onClick={leaveProject} className={style.content}>
                    <LogoutOutlined style={{ color: '#FF2D20', fontSize: 20 }} />
                    <span style={{ color: '#FF2D20' }}>Leave</span>
                </div>
            )}
        </div>
    );
};

export default ProjectMenu;
