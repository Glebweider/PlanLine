import { Link } from 'react-router-dom';
import style from './NavbarCard.module.scss';


interface NavbarCardProps {
    Icon: React.ReactNode;
    title: string; 
    href: string;
    currentPath: string;
}

const NavbarCard: React.FC<NavbarCardProps> = ({ Icon, title, href, currentPath }) => {
    const isActive = currentPath.includes(href);

    return (
        <Link 
            to={`/${href}`}
            className={`${style.container} ${isActive ? style.active : ''} ${!title ? style.navbarClose : ''}`}>
            {Icon}
            <text>{title}</text>
        </Link>
    );
};

export default NavbarCard;
