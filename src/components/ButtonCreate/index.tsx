import { PlusOutlined } from "@ant-design/icons";

import styles from './ButtonCreate.module.scss';


export interface IButtonCreate {
    setIsOpenCreateBoardModal: React.Dispatch<React.SetStateAction<boolean>>;
    style?: string;
    onClick?: () => void;
}

const ButtonCreate: React.FC<IButtonCreate> = ({ setIsOpenCreateBoardModal, style, onClick }) => {
    const handleClick = () => {
        if (onClick) onClick();
        setIsOpenCreateBoardModal(true);
    };

    return (
        <div
            onClick={handleClick}
            className={`${style ?? ''} ${styles.addBoardContainer}`}>
            <PlusOutlined />
        </div>
    );
};

export default ButtonCreate;