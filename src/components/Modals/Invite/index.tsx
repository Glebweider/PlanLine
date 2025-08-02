import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import style from './InviteModal.module.scss';
import { useAlert } from '../../Alert/context';
import { RootState } from '../../../redux/store';


interface InviteModalProps {
    isOpenModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const InviteModal: React.FC<InviteModalProps> = ({ isOpenModal, setOpenModal }) => {
    const { showAlert } = useAlert();
    const projectState = useSelector((state: RootState) => state.projectReducer);

    const [selectedBoardId, setSelectedBoardId] = useState<string>('');
    const [isChange, setIsChange] = useState<boolean>(false);
    const [inviteLink, setInviteLink] = useState<string>('');


    useEffect(() => {
        setInviteLink('');
    }, [isOpenModal]);

    const saveChanges = async () => {
        if (isChange) return;

        try {
            setIsChange(true);
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/${projectState.id}/invite`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ...(selectedBoardId ? { boardId: selectedBoardId } : {})
                    })
                }
            );

            const data = await response.text();

            if (!response.ok) {
                const dataErr = await response.json();
                showAlert(`Server error: ${response.status}, ${dataErr.message}`);
                return;
            }

            setInviteLink(data);
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
        } finally {
            setIsChange(false);
        }
    };

    if (!isOpenModal) return null;

    return (
        <div
            onClick={() => setOpenModal(false)}
            className={style.modalOverlay}>
            <div
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                className={style.modal}>
                <h2 style={{ fontSize: 26, marginBottom: 5 }}>Invite Users</h2>
                <div className={style.userInfo}>
                    <text>Board</text>
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

                {inviteLink && (
                    <div className={style.inviteLinkBox}>
                        <p>Invite link:</p>
                        <div className={style.inviteLinkContent}>
                            <input
                                type="text"
                                value={inviteLink}
                                readOnly
                                className={style.input} />
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(inviteLink);
                                    showAlert('Link copied!');
                                }}
                                className={style.copyButton}>
                                Copy
                            </button>
                        </div>
                    </div>
                )}

                <hr />
                <button
                    className={style.saveButton}
                    disabled={isChange || inviteLink.length > 0}
                    onClick={saveChanges}>
                    Create Invite
                </button>
            </div>
        </div>
    );
};

export default InviteModal;
