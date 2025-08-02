import { useState } from 'react';
import { useSelector } from 'react-redux';
import { MoreOutlined } from '@ant-design/icons';

import style from './UserCard.module.scss';
import { IUserProject } from '../../pages/AllUsersProjectPage';
import { Avatar } from '../Avatar';
import formatDateShortEn from '../../utils/FormatDateShortEn';
import { RootState } from '../../redux/store';
import UserSettingModal from '../Modals/UserSetting';


interface UserCardProps {
    user: any;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
    const projectState = useSelector((state: RootState) => state.projectReducer);
    const userId = useSelector((state: RootState) => state.userReducer.id);

    const [isOpenUserSettingsMenu, setIsOpenUserSettingsMenu] = useState<boolean>(false);

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
                        onClick={() => setIsOpenUserSettingsMenu(!isOpenUserSettingsMenu)}
                        style={{ fontSize: 30, marginRight: -10 }} />
                }
            </div>
            <UserSettingModal
                isOpenModal={isOpenUserSettingsMenu}
                setOpenModal={setIsOpenUserSettingsMenu}
                username={user?.name}
                discordId={user?.id} />
        </div>
    );
};

export default UserCard;
