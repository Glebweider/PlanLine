import { useState } from 'react';
import { useDispatch } from 'react-redux';

import style from './NewListModal.module.scss';
import { useAlert } from '../../Alert/context';
import { addListToBoard } from '../../../redux/reducers/projectReducer';


interface NewListModalProps {
    isOpenModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    projectId: string;
    boardId: string;
}

const NewListModal: React.FC<NewListModalProps> = ({ isOpenModal, projectId, boardId, setOpenModal }) => {
    const { showAlert } = useAlert();
    const dispatch = useDispatch();

    const [isCreatingList, setIsCreatingList] = useState<boolean>(false);
    const [newListName, setNewListName] = useState<string>('');


    const createList = async () => {
        if (newListName.length < 1) {
            showAlert('List name must be at least 1 character');
            return;
        }
        if (newListName.length > 16) {
            showAlert('List name must be no more than 16 characters');
            return;
        }

        if (isCreatingList) return;

        setIsCreatingList(true);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/${projectId}/boards/${boardId}`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: newListName,
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                showAlert(`Server error: ${response.status}, ${data.message}`);
                return;
            }

            dispatch(addListToBoard({
                boardId: boardId,
                list: data
            }));

            setNewListName('');
            setOpenModal(false);
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
        } finally {
            setIsCreatingList(false);
        }
    };

    if (!isOpenModal) return null;
    
    return (
        <div
            onClick={() => {
                setOpenModal(false);
                setNewListName('');
            }}
            className={style.modalOverlay}>
            <div
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                className={style.modal}>
                <h2 style={{ color: '#fff', fontSize: 26 }}>Create New List</h2>

                <div className={style.userInfo}>
                    <text>List Name</text>
                    <input
                        type="text"
                        placeholder="Enter list name"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        className={style.select} />
                </div>

                <hr className={style.hr} />
                <div
                    onClick={() => !isCreatingList && createList()}
                    className={style.saveButton}
                    style={{ opacity: isCreatingList ? 0.5 : 1 }}>
                    Create
                </div>
            </div>
        </div>

    );
};

export default NewListModal;
