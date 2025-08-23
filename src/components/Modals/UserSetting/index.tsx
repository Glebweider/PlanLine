import { useEffect, useState } from 'react';
import { SafetyCertificateOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

import style from './UserSettingModal.module.scss';
import { useAlert } from '../../Alert/context';
import { RootState } from '../../../redux/store';


interface UserSettingModalProps {
    username: string;
    discordId: string;
    isOpenModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserSettingModal: React.FC<UserSettingModalProps> = ({ username, discordId, isOpenModal, setOpenModal }) => {
    const { showAlert } = useAlert();
    
    const projectState = useSelector((state: RootState) => state.projectReducer);

    const [selectedBoardId, setSelectedBoardId] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [isChange, setIsChange] = useState<boolean>(false);

    useEffect(() => {
        const board = projectState.boards.find(b => b.id === selectedBoardId);

        if (!board) {
            setSelectedRole('');
            return;
        }

        const member = board.members.find(m => m.id === discordId);

        if (member) {
            setSelectedRole(member.role);
        } else {
            setSelectedRole('');
        }
    }, [selectedBoardId, discordId, projectState.boards]);


    const roleDescription = () => {
        switch (selectedRole) {
            case 'Admin':
                return 'This user will be granted the privilege of an Admin Level User and can perform the actions permitted to that role in the management system.';
            case 'Observer':
                return 'This user can view boards and tasks but cannot modify them.';
            case 'Normal':
                return 'This user can create and edit tasks assigned to them.';
            default:
                return '';
        }
    };

    const saveChanges = async () => {
        if (isChange) return;

        try {
            setIsChange(true);
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/${projectState.id}/boards/${selectedBoardId}/change-user-roles`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        discordId: discordId,
                        role: selectedRole
                    })
                }
            );

            if (!response.ok) {
                const data = await response.json();
                showAlert(`Server error: ${response.status}, ${data.message}`);
                return;
            }

            setOpenModal(false);
            setSelectedBoardId('');
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
        } finally {
            setIsChange(false);
        }
    };

    if (isOpenModal) {
        return (
            <div
                onClick={() => {
                    setOpenModal(false);
                    setSelectedBoardId('');
                }}
                className='modalOverlay'>
                <div
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    className={style.modal}>
                    <h2 style={{ fontSize: 26, marginBottom: 15 }}>Edit User</h2>

                    <div className={style.userInfo}>
                        <label>Discord id</label>
                        <div>{discordId}</div>
                    </div>
                    <div className={style.userInfo}>
                        <label>Nickname</label>
                        <div>{username}</div>
                    </div>

                    <div className={style.userInfo}>
                        <label>Board</label>
                        <select
                            value={selectedBoardId}
                            onChange={(e) => setSelectedBoardId(e.target.value)}
                            className={style.select}>
                            <option value="">Select Board</option>
                            {projectState.boards.map(board => (
                                <option key={board.id} value={board.id}>{board.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={style.roles}>
                        <button
                            className={`${style.roleButton} ${selectedRole === 'Observer' ? style.active : ''}`}
                            disabled={!selectedBoardId}
                            onClick={() => setSelectedRole('Observer')}>
                            <UserOutlined style={{ fontSize: 22 }} />
                            Observer
                        </button>
                        <button
                            className={`${style.roleButton} ${selectedRole === 'Normal' ? style.active : ''}`}
                            disabled={!selectedBoardId}
                            onClick={() => setSelectedRole('Normal')}>
                            <TeamOutlined style={{ fontSize: 24 }} />
                            User
                        </button>
                        <button
                            className={`${style.roleButton} ${selectedRole === 'Admin' ? style.active : ''}`}
                            disabled={!selectedBoardId}
                            onClick={() => setSelectedRole('Admin')}>
                            <SafetyCertificateOutlined style={{ fontSize: 24 }} />
                            Admin
                        </button>
                    </div>

                    {selectedRole &&
                        <text className={style.warning}>{roleDescription()}</text>
                    }
                    <hr className={style.hr} />

                    <button
                        className={style.saveButton}
                        disabled={!selectedBoardId || !selectedRole || isChange}
                        onClick={saveChanges}>
                        Save Changes
                    </button>
                </div>
            </div>
        );
    } else {
        return <></>
    }
};

export default UserSettingModal;
