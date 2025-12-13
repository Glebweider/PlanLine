import { useSelector } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import React from 'react';

import style from './UserSettingsMenu.module.scss';
import { RootState } from '../../../redux/store';
import { useAlert } from '../../../components/Alert/context';
import { EMemberRole, IUserProject } from '../../../redux/reducers/projectReducer';


interface UserSettingsMenuProps {
    isOpen: boolean;
    member: IUserProject;
    onClose: () => void;
}

const roleMap: Record<string, EMemberRole> = {
    Admin: EMemberRole.ADMIN,
    Normal: EMemberRole.NORMAL,
    Observer: EMemberRole.OBSERVER,
};

const enumToApiRole: Record<EMemberRole, string> = {
    [EMemberRole.ADMIN]: 'Admin',
    [EMemberRole.NORMAL]: 'Normal',
    [EMemberRole.OBSERVER]: 'Observer',
};

const UserSettingsMenu: React.FC<UserSettingsMenuProps> = ({ isOpen, member, onClose }) => {
    const { showAlert } = useAlert();
    const MemberRolesArray = Object.values(EMemberRole);

    const menuRef = useRef<HTMLDivElement>(null);
    const selectorRef = useRef<HTMLDivElement>(null);

    const [selectedBoard, setSelectedBoard] = useState<string>('');
    const [value, onChange] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<EMemberRole>(MemberRolesArray[2]);
    const [open, setOpen] = useState<boolean>(false);
    const [isChange, setIsChange] = useState<boolean>(false);
    const [isKickUser, setIsKickUser] = useState<boolean>(false);

    const projectState = useSelector((state: RootState) => state.projectReducer);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen, onClose]);

    useEffect(() => {
        const board = projectState.boards.find(board => board.id === selectedBoard);
        const memberRoleRaw = board?.members.find(boardMember => boardMember.id === member.id)?.role;

        if (memberRoleRaw) {
            const roleEnum = roleMap[memberRoleRaw];
            if (roleEnum) setSelectedRole(roleEnum);
        }
    }, [selectedBoard]);

    const saveChanges = async () => {
        if (isChange) return;

        try {
            setIsChange(true);

            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/${projectState.id}/boards/${selectedBoard}/change-user-roles`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        discordId: member.id,
                        role: enumToApiRole[selectedRole]
                    }),
                }
            );

            if (!response.ok) {
                const data = await response.json();
                showAlert(`Server error: ${response.status}, ${data.message}`);
                return;
            }

            setSelectedBoard('');
            onChange('');
            onClose();
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
        } finally {
            setIsChange(false);
        }
    };

    const kick = async () => {
        if (isKickUser) return;

        setIsKickUser(true);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/${projectState.id}/kick`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        discordId: member.id,
                    })
                }
            );

            if (!response.ok) {
                const data = await response.json();
                showAlert(`Server error: ${response.status}, ${data.message}`);
                return;
            }

            onClose();
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
        } finally {
            setIsKickUser(false);
        }
    };

    return (
        <div
            ref={menuRef}
            className={`${style.container} ${isOpen ? style.open : ''}`}>
            <div className={style.header}>
                <text>User’s settings</text>
                <svg
                    onClick={kick}
                    width="15"
                    height="18"
                    viewBox="0 0 15 18"
                    fill="none">
                    <path d="M9.20454 0C9.54 0 9.81818 0.278183 9.81818 0.613638V1.63637H14.1136C14.4491 1.63637 14.7273 1.91455 14.7273 2.25001V2.6591C14.7273 2.99455 14.4491 3.27274 14.1136 3.27274H0.613636C0.45089 3.27274 0.294809 3.20809 0.17973 3.09301C0.0646507 2.97793 0 2.82185 0 2.6591V2.25001C0 1.91455 0.278182 1.63637 0.613636 1.63637H4.90909V0.613638C4.90909 0.278183 5.18727 0 5.52273 0H9.20454Z" fill="#EF869F" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.68562 4.90918C1.57392 4.90898 1.46336 4.93165 1.36075 4.97581C1.25814 5.01996 1.16566 5.08466 1.08901 5.16591C1.01235 5.24716 0.953151 5.34325 0.915045 5.44825C0.87694 5.55326 0.860739 5.66495 0.867441 5.77646L1.48926 15.701C1.52884 16.3247 1.80481 16.9098 2.26091 17.337C2.717 17.7642 3.31888 18.0014 3.9438 18.0001H10.7838C11.4087 18.0014 12.0106 17.7642 12.4667 17.337C12.9228 16.9098 13.1988 16.3247 13.2383 15.701L13.852 5.77646C13.8587 5.66495 13.8425 5.55326 13.8044 5.44825C13.7663 5.34325 13.7071 5.24716 13.6304 5.16591C13.5538 5.08466 13.4613 5.01996 13.3587 4.97581C13.2561 4.93165 13.1455 4.90898 13.0338 4.90918H1.6938H1.68562ZM6.54562 9.0001C6.54562 8.78311 6.45942 8.575 6.30598 8.42156C6.15254 8.26812 5.94444 8.18192 5.72744 8.18192C5.51045 8.18192 5.30234 8.26812 5.1489 8.42156C4.99546 8.575 4.90926 8.78311 4.90926 9.0001V13.9092C4.90926 14.1262 4.99546 14.3343 5.1489 14.4878C5.30234 14.6412 5.51045 14.7274 5.72744 14.7274C5.94444 14.7274 6.15254 14.6412 6.30598 14.4878C6.45942 14.3343 6.54562 14.1262 6.54562 13.9092V9.0001ZM9.00017 8.18192C9.21716 8.18192 9.42527 8.26812 9.57871 8.42156C9.73215 8.575 9.81835 8.78311 9.81835 9.0001V13.9092C9.81835 14.1262 9.73215 14.3343 9.57871 14.4878C9.42527 14.6412 9.21716 14.7274 9.00017 14.7274C8.78317 14.7274 8.57506 14.6412 8.42163 14.4878C8.26819 14.3343 8.18199 14.1262 8.18199 13.9092V9.0001C8.18199 8.78311 8.26819 8.575 8.42163 8.42156C8.57506 8.26812 8.78317 8.18192 9.00017 8.18192Z" fill="#EF869F" />
                </svg>
            </div>
            <hr />

            <div className={style.wrapper} ref={selectorRef} onClick={() => setOpen(!open)}>
                <svg
                    className={style.icon}
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none">
                    <path d="M4.92169 11.8124C4.72169 11.8124 4.53598 11.6999 4.44312 11.5049C4.30741 11.2274 4.41455 10.8899 4.68598 10.7474C5.30741 10.4249 5.83598 9.9299 6.21455 9.3299C6.34312 9.1274 6.34312 8.8724 6.21455 8.6699C5.82884 8.0699 5.30026 7.5749 4.68598 7.2524C4.41455 7.1174 4.30741 6.7799 4.44312 6.4949C4.57169 6.2174 4.89312 6.1049 5.15741 6.2474C5.94312 6.6599 6.61455 7.2824 7.10026 8.0474C7.46455 8.6249 7.46455 9.3749 7.10026 9.9524C6.61455 10.7174 5.94312 11.3399 5.15741 11.7524C5.08598 11.7899 5.00026 11.8124 4.92169 11.8124Z" fill="#D4D4D4" />
                    <path d="M12.1431 11.8125H9.28596C8.9931 11.8125 8.75024 11.5575 8.75024 11.25C8.75024 10.9425 8.9931 10.6875 9.28596 10.6875H12.1431C12.436 10.6875 12.6788 10.9425 12.6788 11.25C12.6788 11.5575 12.436 11.8125 12.1431 11.8125Z" fill="#D4D4D4" />
                    <path d="M10.7146 17.0625H6.4289C2.55033 17.0625 0.893188 15.3225 0.893188 11.25V6.75C0.893188 2.6775 2.55033 0.9375 6.4289 0.9375H10.7146C14.5932 0.9375 16.2503 2.6775 16.2503 6.75V11.25C16.2503 15.3225 14.5932 17.0625 10.7146 17.0625ZM6.4289 2.0625C3.13605 2.0625 1.96462 3.2925 1.96462 6.75V11.25C1.96462 14.7075 3.13605 15.9375 6.4289 15.9375H10.7146C14.0075 15.9375 15.1789 14.7075 15.1789 11.25V6.75C15.1789 3.2925 14.0075 2.0625 10.7146 2.0625H6.4289Z" fill="#D4D4D4" />
                </svg>
                <div className={style.label}>
                    {value || "Select board"}
                </div>
                <svg
                    className={`${style.arrow} ${open ? style.active : ''}`}
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none">
                    <path d="M9.0606 0H4.69118H0.756598C0.0833007 0 -0.253348 0.87 0.223571 1.38L3.85657 5.265C4.43869 5.8875 5.38552 5.8875 5.96764 5.265L7.3493 3.7875L9.60064 1.38C10.0705 0.87 9.7339 0 9.0606 0Z" fill="#D4D4D4" />
                </svg>
                {open && (
                    <div className={style.dropdown}>
                        {projectState.boards.map((board) => (
                            <div
                                key={board.id}
                                className={style.item}
                                onClick={() => {
                                    onChange(board.name);
                                    setSelectedBoard(board.id);
                                    setOpen(false);
                                }}>
                                <span />
                                {board.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <text className={style.warningText}>In this field, you can select the board in which to assign a role
                to the selected user.</text>

            <div className={style.containerRoles}>
                <div className={style.contentRole}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M8.57143 9C10.5439 9 12.1429 7.32107 12.1429 5.25C12.1429 3.17893 10.5439 1.5 8.57143 1.5C6.59898 1.5 5 3.17893 5 5.25C5 7.32107 6.59898 9 8.57143 9Z" stroke="#D4D4D4" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M13.7211 11.805L11.1925 14.46C11.0925 14.565 10.9996 14.76 10.9782 14.9025L10.8425 15.915C10.7925 16.2825 11.0353 16.5375 11.3853 16.485L12.3496 16.3425C12.4853 16.32 12.6782 16.2225 12.771 16.1175L15.2996 13.4625C15.7353 13.005 15.9425 12.4725 15.2996 11.7975C14.6639 11.13 14.1568 11.3475 13.7211 11.805Z" stroke="#D4D4D4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M13.3574 12.1875C13.5717 12.9975 14.1717 13.6275 14.9431 13.8525" stroke="#D4D4D4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M2.43555 16.5C2.43555 13.5975 5.18557 11.25 8.57128 11.25C9.31414 11.25 10.0284 11.3625 10.6927 11.5725" stroke="#D4D4D4" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                    <text>Select role</text>
                </div>
                <div className={style.roles}>
                    {MemberRolesArray.map(role => (
                        <div
                            key={role}
                            onClick={() => setSelectedRole(role)}
                            className={`${style.role} ${selectedRole === role ? style.active : ''}`}>
                            <text>{role}</text>
                        </div>
                    ))}
                </div>
            </div>
            <hr />

            <div className={style.buttons}>
                <div
                    className={style.applyButton}
                    onClick={saveChanges}>
                    Asign
                </div>
                <div
                    className={style.closeButton}
                    onClick={() => { onClose(); setSelectedBoard(''); }}>
                    Cancel
                </div>
            </div>
        </div>
    );
};

export default UserSettingsMenu;
