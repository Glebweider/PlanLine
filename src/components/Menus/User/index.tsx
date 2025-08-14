import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';

import style from './UserMenu.module.scss';
import UserSettingModal from '../../Modals/UserSetting';
import { useAlert } from '../../Alert/context';
import { removeUserFromProject } from '../../../redux/reducers/projectReducer';


interface UserMenuProps {
    user: any;
    isOpenModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    projectId: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, isOpenModal, setOpenModal, projectId }) => {
    const { showAlert } = useAlert();
    const dispatch = useDispatch();

    const [isOpenUserSettingsMenu, setIsOpenUserSettingsMenu] = useState<boolean>(false);
    const [isKickUser, setIsKickUser] = useState<boolean>(false);
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
            if (!isOpenUserSettingsMenu && menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenModal(false);
            }
        };

        if (isOpenModal)
            document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpenModal, isOpenUserSettingsMenu, setOpenModal]);

    const kickUser = async () => {
        if (isKickUser) return;

        setIsKickUser(true);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/${projectId}/kick`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        discordId: user?.id,
                    })
                }
            );

            if (!response.ok) {
                const data = await response.json();
                showAlert(`Server error: ${response.status}, ${data.message}`);
                return;
            }

            dispatch(removeUserFromProject(user?.id));
            setOpenModal(false);
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
        } finally {
            setIsKickUser(false);
        }
    };

    if (!isOpenMdl) return null;

    return (
        <>
            <div
                ref={menuRef}
                className={`${style.container} ${isOpenModal ? style.open : ''}`}>
                <div
                    onClick={() => setIsOpenUserSettingsMenu(true)}
                    className={style.content}>
                    <SettingOutlined style={{ fontSize: 20 }} />
                    <text>Edit</text>
                </div>
                <div
                    onClick={kickUser}
                    className={style.content}>
                    <LogoutOutlined style={{ color: '#FF2D20', fontSize: 20 }} />
                    <text style={{ color: '#FF2D20' }}>Kick</text>
                </div>
            </div>
            <UserSettingModal
                isOpenModal={isOpenUserSettingsMenu}
                setOpenModal={setIsOpenUserSettingsMenu}
                username={user?.name}
                discordId={user?.id} />
        </>
    );
}

export default UserMenu;