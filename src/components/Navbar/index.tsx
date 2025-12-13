import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import style from './Navbar.module.scss';
import { Avatar } from '../Avatar';
import { RootState } from '../../redux/store';
import LeaveModal from '../Modals/Leave';
import { useState } from 'react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const user = useSelector((state: RootState) => state.userReducer);

    const [isOpenModal, setOpenModal] = useState<boolean>(false);

    const isProjects = location.pathname.startsWith("/projects");
    const isTasks = location.pathname.startsWith("/tasks");

    return (
        <>
            <div className={style.container}>
                <div className={style.userContainer}>
                    <Avatar size={32} />
                    <a>{user.username}</a>
                </div>
                <div className={style.buttonsContainer}>
                    <div
                        onClick={() => navigate('/projects')}
                        className={`${isProjects ? style.buttonContainerActive : ''} ${style.buttonContainer}`}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M5.99999 16.5H12C15.015 16.5 15.555 15.2925 15.7125 13.8225L16.275 7.8225C16.4775 5.9925 15.9525 4.5 12.75 4.5H5.24999C2.04749 4.5 1.52249 5.9925 1.72499 7.8225L2.28749 13.8225C2.44499 15.2925 2.98499 16.5 5.99999 16.5Z" stroke="#303037" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M6 4.5V3.9C6 2.5725 6 1.5 8.4 1.5H9.6C12 1.5 12 2.5725 12 3.9V4.5" stroke="#303037" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M10.5 9.75V10.5C10.5 10.5075 10.5 10.5075 10.5 10.515C10.5 11.3325 10.4925 12 9 12C7.515 12 7.5 11.34 7.5 10.5225V9.75C7.5 9 7.5 9 8.25 9H9.75C10.5 9 10.5 9 10.5 9.75Z" stroke="#303037" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M16.2375 8.25C14.505 9.51 12.525 10.26 10.5 10.515" stroke="#303037" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M1.96497 8.45264C3.65247 9.60764 5.55747 10.3051 7.49997 10.5226" stroke="#303037" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <text>Projects</text>
                    </div>
                    <div
                        onClick={() => navigate('/tasks')}
                        className={`${isTasks ? style.buttonContainerActive : ''} ${style.buttonContainer}`}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M10.2975 2.63248L11.6175 5.27248C11.7975 5.63998 12.2775 5.99248 12.6825 6.05998L15.075 6.45748C16.605 6.71248 16.965 7.82248 15.8625 8.91748L14.0025 10.7775C13.6875 11.0925 13.515 11.7 13.6125 12.135L14.145 14.4375C14.565 16.26 13.5975 16.965 11.985 16.0125L9.74249 14.685C9.33749 14.445 8.66999 14.445 8.25749 14.685L6.01499 16.0125C4.40999 16.965 3.43499 16.2525 3.85499 14.4375L4.38749 12.135C4.48499 11.7 4.31249 11.0925 3.99749 10.7775L2.13749 8.91748C1.04249 7.82248 1.39499 6.71248 2.92499 6.45748L5.31749 6.05998C5.71499 5.99248 6.19499 5.63998 6.37499 5.27248L7.69499 2.63248C8.41499 1.19998 9.58499 1.19998 10.2975 2.63248Z" stroke="#303037" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <text>My Tasks</text>
                    </div>
                    <svg
                        onClick={() => setOpenModal(true)}
                        className={style.buttonLeave}
                        width="18"
                        height="18"
                        viewBox="0 0 26 26"
                        fill="none">
                        <path d="M9.6416 8.19001C9.97743 4.29001 11.9816 2.69751 16.3691 2.69751H16.5099C21.3524 2.69751 23.2916 4.63668 23.2916 9.47918V16.5425C23.2916 21.385 21.3524 23.3242 16.5099 23.3242H16.3691C12.0141 23.3242 10.0099 21.7533 9.65244 17.9183" stroke="#303037" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M16.25 13H3.92163" stroke="#303037" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M6.33742 9.37085L2.70825 13L6.33742 16.6292" stroke="#303037" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
            </div>
            <LeaveModal 
                isOpen={isOpenModal} 
                onClose={() => setOpenModal(false)} />
        </>
    );
};

export default Navbar;
