import { useSelector } from 'react-redux';
import { LogoutOutlined, SettingOutlined, TeamOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';


import style from './ProjectMenu.module.scss';
import { RootState } from '../../redux/store';
import { useState, useEffect } from 'react';


interface ProjectMenuProps {
    isOpenModal: boolean;
    projectOwnerId: string;
    projectId: string;
}

const ProjectMenu: React.FC<ProjectMenuProps> = ({ isOpenModal, projectOwnerId, projectId }) => {
    const userId = useSelector((state: RootState) => state.userReducer.id);
    
    const [isOpenMdl, setIsOpenMdl] = useState<boolean>(false);

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

        // TODO Додепать
        console.log('Leave Porject')
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
