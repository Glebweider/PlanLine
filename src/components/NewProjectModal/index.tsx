import { useState } from 'react';

import style from './NewProjectModal.module.scss';
import { useAlert } from '../Alert/context';
import { IPreviewProject } from '../Navbar';


interface NewProjectModalProps {
    setProjects: React.Dispatch<React.SetStateAction<IPreviewProject[]>>;
    isOpenModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewProjectModal: React.FC<NewProjectModalProps> = ({ setProjects, isOpenModal, setOpenModal }) => {
    const { showAlert } = useAlert();

    const [isCreatingProject, setIsCreatingProject] = useState<boolean>(false);
    const [newProjectName, setNewProjectName] = useState<string>('');

    const createProject = async () => {
        if (newProjectName.length < 1) {
            showAlert('Project name must be at least 1 character');
            return;
        }
        if (newProjectName.length > 12) {
            showAlert('Project name must be no more than 12 characters');
            return;
        }

        if (isCreatingProject) return;

        setIsCreatingProject(true);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: newProjectName,
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                showAlert(`Server error: ${response.status}, ${data.message}`);
                return;
            }

            setProjects(prevProjects => [...prevProjects, data]);
            setNewProjectName('');
            setOpenModal(false);
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
        } finally {
            setIsCreatingProject(false);
        }
    };

    if (isOpenModal) {
        return (
            <div className={style.modalOverlay}>
                <div className={style.modalContent}>
                    <a style={{ color: '#fff', fontSize: 18 }}>Create New Project</a>
                    <div className={style.modalData}>
                        <input
                            type="text"
                            placeholder="Enter project name"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            className={style.inputField} />
                    </div>
                    <div style={{ display: 'flex' }}>
                        <div
                            onClick={() => !isCreatingProject && createProject()}
                            className={style.createProjectButton}
                            style={{ opacity: isCreatingProject ? 0.5 : 1 }}>Create</div>
                        <div onClick={() => setOpenModal(false)} className={style.createProjectButton}>Close</div>
                    </div>
                </div>
            </div>
        );
    } else {
        return <></>
    }

};

export default NewProjectModal;
