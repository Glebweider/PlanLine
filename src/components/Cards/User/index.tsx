import { useState } from 'react';
import { useSelector } from 'react-redux';

import style from './UserCard.module.scss';
import { IUserProject } from "../../../redux/reducers/projectReducer";
import { Avatar } from '../../../components/Avatar';
import UserSettingsMenu from '../../../components/Menus/UserSettings';
import { RootState } from '../../../redux/store';


interface UserCardProps {
    member: IUserProject;
    permission: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ member, permission }) => {
    const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);

    const userState = useSelector((state: RootState) => state.userReducer);

    return (
        <>
            <div className={style.container}>
                <div className={style.content}>
                    <Avatar className={style.avatar} size={46} user={member} />
                    <span>
                        {member.displayName ? member.displayName : member.name}
                    </span>
                </div>
                {permission && userState.id != member.id &&
                    <img
                        className={style.buttonEdit}
                        onClick={() => setIsOpenMenu(true)}
                        src='./icons/Settings.svg' />
                }
                <UserSettingsMenu
                    isOpen={isOpenMenu}
                    member={member}
                    onClose={() => setIsOpenMenu(false)} />
            </div>
        </>
    );
};

export default UserCard;
