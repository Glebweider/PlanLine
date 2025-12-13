import { useState } from 'react';

import style from './CreateNewModal.module.scss';
import { useAlert } from '../../Alert/context';


interface CreateNewModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    maxLength: number;
    onSubmit: (value: string) => Promise<void>;
}

const CreateNewModal: React.FC<CreateNewModalProps> = ({
    isOpen,
    onClose,
    title,
    maxLength,
    onSubmit
}) => {
    const { showAlert } = useAlert();

    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const create = async () => {
        if (value.length < 1) {
            showAlert(`${title.replace(":", "")} must be at least 1 character`);
            return;
        }
        if (value.length > maxLength) {
            showAlert(`${title.replace(":", "")} must be no more than ${maxLength} characters`);
            return;
        }
        if (isLoading) return;

        setIsLoading(true);

        try {
            await onSubmit(value);
            setValue('');
            onClose();
        } catch (error) {
            showAlert(`Error: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return <></>;

    return (
        <div className="modalOverlay" onClick={() => { onClose(); setValue(''); }}>
            <div
                className={style.modalContent}
                onClick={(e) => e.stopPropagation()}>
                <div className={style.modalContentContainer}>
                    <div className={style.modalHeader}>
                        <img src="./icons/Edit.svg" />
                        <a>{title}</a>
                    </div>

                    <div className={style.modalData}>
                        <div className={style.modalInputFieldContainer}>
                            <input
                                type="text"
                                placeholder="Enter name"
                                value={value}
                                maxLength={maxLength}
                                onChange={(e) => setValue(e.target.value)}
                                className={style.inputField}
                            />
                        </div>
                        <hr />
                    </div>

                    <div className={style.modalButtons}>
                        <div
                            className={style.closeButton}
                            onClick={() => { onClose(); setValue(''); }}>
                            Decline
                        </div>

                        <div
                            className={style.createButton}
                            onClick={create}
                            style={{ opacity: isLoading ? 0.5 : 1 }}>
                            Accept
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default CreateNewModal;
