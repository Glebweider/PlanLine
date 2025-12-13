import { useState } from 'react';

import style from './LeaveProjectModal.module.scss';
import { useAlert } from '../../Alert/context';
import { IProjectPreviewCard } from '../../../pages/ProjectsPage';


interface LeaveProjectModalProps {
    isOpen: boolean;
    projectId: string;
    projectTitle: string;
    onClose: () => void;
    setProjects: React.Dispatch<React.SetStateAction<IProjectPreviewCard[]>>;
}

const LeaveProjectModal: React.FC<LeaveProjectModalProps> = ({
    isOpen,
    projectId,
    projectTitle,
    onClose,
    setProjects
}) => {
    const { showAlert } = useAlert();

    const [isLoading, setIsLoading] = useState(false);

    const leave = async () => {
        if (isLoading) return;

        setIsLoading(true);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/${projectId}/leave`,
                {
                    method: 'POST',
                    credentials: 'include',
                }
            );

            if (!response.ok) {
                const data = await response.json();
                showAlert(`Server error: ${response.status}, ${data.message}`);
                return;
            }

            setProjects(prev => prev.filter(project => project.id !== projectId));
            onClose();
        } catch (error) {
            showAlert(`Error: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return <></>;

    return (
        <div className="modalOverlay" onClick={() => { onClose(); }}>
            <div
                className={style.modalContent}
                onClick={(e) => e.stopPropagation()}>
                <div className={style.modalContentContainer}>
                    <div className={style.modalHeader}>
                        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.6416 8.19001C9.97743 4.29001 11.9816 2.69751 16.3691 2.69751H16.5099C21.3524 2.69751 23.2916 4.63668 23.2916 9.47918V16.5425C23.2916 21.385 21.3524 23.3242 16.5099 23.3242H16.3691C12.0141 23.3242 10.0099 21.7533 9.65244 17.9183" stroke="#D4D4D4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M16.25 13H3.92163" stroke="#D4D4D4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M6.33742 9.37085L2.70825 13L6.33742 16.6292" stroke="#D4D4D4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <a>Are you sure you want to leave the project</a>
                        <text>{projectTitle}</text>
                        <span>You will lose access to project resources.</span>
                    </div>
                    <div className={style.modalButtons}>
                        <div
                            className={style.leaveButton}
                            onClick={leave}
                            style={{ opacity: isLoading ? 0.5 : 1 }}>
                            Accept
                        </div>
                        <div
                            className={style.closeButton}
                            onClick={() => { onClose(); }}>
                            Decline
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default LeaveProjectModal;
