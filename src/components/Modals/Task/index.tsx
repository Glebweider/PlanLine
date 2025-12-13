import style from './TaskModal.module.scss';
import { ICard } from '../../../redux/reducers/projectReducer';
import { useRef, useEffect } from 'react';


interface TaskModalProps {
    task: ICard,
    isOpen: boolean;
    onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
    task,
    isOpen,
    onClose,
}) => {

    if (!isOpen) return <></>;

    return (
        <div className="modalOverlay" onClick={() => { onClose(); }}>
            <div
                className={style.modalContent}
                onClick={(e) => e.stopPropagation()}>
                <div className={style.modalContentContainer}>
                    <div className={style.modalHeader}>
                        <div style={{ display: 'flex', maxHeight: 60 }}>
                            <img src="./icons/Ellipse.svg" />
                            <div className={style.modalData}>
                                <div className={style.modalInputFieldContainer}>
                                    <text className={style.inputField}>
                                        {task.title}
                                    </text>
                                </div>
                            </div>
                        </div>
                        <div className={style.rightModalData}>
                            <img onClick={() => console.log(123)} src='./icons/Profile-User.svg' />
                            <img onClick={() => console.log(123)} src='./icons/Calendar.svg' />
                        </div>
                    </div>
                    <div className={style.descriptionBox}>
                        <div
                            className={style.taskContent}
                            style={{
                                minHeight: 120,
                                maxHeight: 640,
                                padding: "6px 18px 6px 18px",
                            }}
                            dangerouslySetInnerHTML={{ __html: task.description }} />
                        <hr />
                    </div>
                </div>
            </div>
        </div>
    )
};

export default TaskModal;
