import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

import style from './NewMember.module.scss';
import UserSettingModal from '../../Modals/UserSetting';
import { useAlert } from '../../Alert/context';
import { IProject, removeUserFromProject } from '../../../redux/reducers/projectReducer';


interface NewMemberProps {
    user: any;
    isOpenModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    project: IProject;
}

const NewMemberMenu: React.FC<NewMemberProps> = ({ user, isOpenModal, setOpenModal, project }) => {
    const { showAlert } = useAlert();
    const dispatch = useDispatch();

    const [isOpenMdl, setIsOpenMdl] = useState<boolean>(false);


    useEffect(() => {
        if (isOpenModal) {
            setIsOpenMdl(true);
        } else {
            const timer = setTimeout(() => {
                setIsOpenMdl(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isOpenModal]);

    const addUser = async () => {
        //
    };

    if (!isOpenMdl) return <></>

    return (
        <div className={`${style.container} ${isOpenModal ? style.open : ''}`}>
            <div
                onClick={() => console.log()}
                className={style.content}>
                <SettingOutlined style={{ fontSize: 20 }} />
                <text>Edit</text>
            </div>

        </div>
    );
}

export default NewMemberMenu;