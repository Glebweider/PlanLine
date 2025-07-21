import { LogoutOutlined } from '@ant-design/icons';
import style from './UserMenu.module.scss';
import { useNavigate } from 'react-router-dom';

export default function UserMenu({ isOpen }: any) {
    const navigate = useNavigate();

    const logoutUser = async () => {
        try {
            await fetch(`${process.env.REACT_APP_BACKEND_URI}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (e) {
            console.error(e);
        } finally {
            navigate('/auth');
        }
    };

    return (
        <div className={`${style.userMenu} ${isOpen ? style.open : ''}`}>
            <button onClick={() => logoutUser()}>
                Выйти
                <LogoutOutlined />
            </button>
        </div>
    );
}
