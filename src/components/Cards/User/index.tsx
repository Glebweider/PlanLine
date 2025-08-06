import { useState } from 'react';
import { useSelector } from 'react-redux';
import { MoreOutlined } from '@ant-design/icons';

import style from './UserCard.module.scss';
import { Avatar } from '../../Avatar';
import formatDateShortEn from '../../../utils/FormatDateShortEn';
import { RootState } from '../../../redux/store';
import UserMenu from '../../Menus/User';


interface UserCardProps {
    user: any;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
    const projectState = useSelector((state: RootState) => state.projectReducer);
    const userId = useSelector((state: RootState) => state.userReducer.id);

    const [isOpenUserMenu, setIsOpenUserMenu] = useState<boolean>(false);

    return (
        <div style={{ display: 'flex', position: 'relative' }}>
            <div className={style.container}>
                <div className={style.content}>
                    <Avatar size={45} user={user} className={style.avatar} />
                    <div className={style.data}>
                        <text className={style.name}>{user?.name}</text>
                        <text className={style.dateOfCreation}>Created: {formatDateShortEn(user?.dateOfCreation)}</text>
                    </div>
                </div>
                {userId == projectState.ownerId && user?.id != projectState.ownerId &&
                    <MoreOutlined
                        onClick={() => setIsOpenUserMenu(!isOpenUserMenu)}
                        style={{ fontSize: 30, marginRight: -10 }} />
                }
            </div>
            <UserMenu
                user={user}
                isOpenModal={isOpenUserMenu}
                projectId={projectState.id}
                setOpenModal={setIsOpenUserMenu} />
        </div>
    );
};

export default UserCard;
