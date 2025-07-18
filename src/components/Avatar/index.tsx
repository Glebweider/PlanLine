// src/components/ui/Profile/index.tsx

// ! own
// ? styles
import style from './Avatar.module.scss';
// ? src
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
type IProfileAvatarIconProps = {
  size: number;
  func?: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Avatar({ size, func }: IProfileAvatarIconProps): JSX.Element {
  const user = useSelector((state: RootState) => state.userReducer);

  const handleClick = () => {
    if (func) {
      func((prev) => !prev);
    }
  };

  return (
    <img
      className={style.avatar}
      onClick={handleClick}
      src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}?size=512`}
      width={size}
      height={size}
      alt={`${user.username} avatar`}
    />
  );
}
