import { Link, useLocation } from 'react-router-dom';
import style from './NavbarProjectCard.module.scss';
import { CheckOutlined } from '@ant-design/icons';


interface NavbarProjectCardProps {
    title: string;
    href: string;
    taskCounter: number;
}

const NavbarProjectCard: React.FC<NavbarProjectCardProps> = ({ title, href, taskCounter }) => {
    const location = useLocation();
    const currentPath = location.pathname;
    const isActive = currentPath.includes(`/project/${href}`);

    return (
        <Link
            to={`/project/${href}`}
            className={`${style.container} ${isActive ? style.active : ''}`}>
            <div className={style.content}>
                <CheckOutlined style={{ fontSize: 18 }} />
                <text>Project {title}</text>
            </div>
            <span className={style.taskCounter}>{taskCounter < 999 ? taskCounter : '+999'}</span>
        </Link>
    );
};

export default NavbarProjectCard;
