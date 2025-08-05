import { PlusOutlined } from "@ant-design/icons";

import styles from './ButtonCreate.module.scss';


export interface IButtonCreate {
    setIsOpenCreateBoardModal: React.Dispatch<React.SetStateAction<boolean>>;
    style?: string;
}

const ButtonCreate: React.FC<IButtonCreate> = ({ setIsOpenCreateBoardModal, style }) => {
    return (
        <div
            onClick={() => setIsOpenCreateBoardModal(true)}
            className={`${style} ${styles.addBoardContainer}`}>
            <PlusOutlined />
        </div>
    );
};

export default ButtonCreate;