import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import style from './NewBoardModal.module.scss';
import { useAlert } from '../../Alert/context';
import { setProject } from '../../../redux/reducers/projectReducer';
import { RootState } from '../../../redux/store';


interface NewBoardModalProps {
    isOpenModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    projectId: string;
}

const NewBoardModal: React.FC<NewBoardModalProps> = ({ isOpenModal, projectId, setOpenModal }) => {
    const { showAlert } = useAlert();
    const dispatch = useDispatch();

    const [isCreatingBoard, setIsCreatingBoard] = useState<boolean>(false);
    const [newBoardName, setNewBoardName] = useState<string>('');

    const projectState = useSelector((state: RootState) => state.projectReducer);

    const createBoard = async () => {
        if (newBoardName.length < 1) {
            showAlert('Board name must be at least 1 character');
            return;
        }
        if (newBoardName.length > 32) {
            showAlert('Board name must be no more than 32 characters');
            return;
        }

        if (isCreatingBoard) return;

        setIsCreatingBoard(true);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/${projectId}/boards`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: newBoardName,
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                showAlert(`Server error: ${response.status}, ${data.message}`);
                return;
            }

            dispatch(setProject({
                ...projectState,
                boards: [...projectState.boards, data],
            }));

            setNewBoardName('');
            setOpenModal(false);
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
        } finally {
            setIsCreatingBoard(false);
        }
    };

    if (isOpenModal) {
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
                    <h2 style={{ color: '#fff', fontSize: 26 }}>Create New Board</h2>

                    <div className={style.userInfo}>
                        <text>Board Name</text>
                        <input
                            type="text"
                            placeholder="Enter board name"
                            value={newBoardName}
                            onChange={(e) => setNewBoardName(e.target.value)}
                            className={style.select} />
                    </div>

                    <hr className={style.hr} />
                    <div
                        onClick={() => !isCreatingBoard && createBoard()}
                        className={style.saveButton}
                        style={{ opacity: isCreatingBoard ? 0.5 : 1 }}>
                        Create
                    </div>
                </div>
            </div>
        );
    } else {
        return <></>
    }
};

export default NewBoardModal;
