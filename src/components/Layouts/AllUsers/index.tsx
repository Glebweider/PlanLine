import { useState } from 'react';
import { useSelector } from 'react-redux';
import { UserAddOutlined } from '@ant-design/icons';

import style from './AllUsersLayout.module.scss';
import { RootState } from '../../../redux/store';
import InviteModal from '../../../components/Modals/Invite';


const AllUsersLayout = () => {
    const projectState = useSelector((state: RootState) => state.projectReducer);
    const userId = useSelector((state: RootState) => state.userReducer.id);

    const [isOpenModalInvite, setOpenModalInvite] = useState<boolean>(false);

    if (userId == projectState.ownerId) {
        return (
            <>
                <div className={style.buttons}>
                    <button
                        onClick={() => setOpenModalInvite(true)}
                        className={style.button}>
                        <UserAddOutlined style={{ fontSize: 22, margin: '0 10 0 15' }} />
                        Invite
                    </button>
                </div>
                <InviteModal
                    isOpenModal={isOpenModalInvite}
                    setOpenModal={setOpenModalInvite} />
            </>
        )
    } else {
        return null;
    }
};

export default AllUsersLayout;
