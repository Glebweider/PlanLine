import style from './Users.module.scss';
import { Avatar } from '../../components/Avatar';
import { TASK_MEMBER_VISIBILITY } from '../../utils/constants';
import { ICard, IProject } from '../../redux/reducers/projectReducer';


interface UsersProps {
    task: ICard,
    projectState: IProject;
}

const Users: React.FC<UsersProps> = ({ task, projectState }) => {
    return (
        <div className={style.users}>
            {task.members.length > TASK_MEMBER_VISIBILITY &&
                <span>+{task.members.length - TASK_MEMBER_VISIBILITY}</span>
            }
            <div className={style.avatars}>
                {task.members.slice(0, TASK_MEMBER_VISIBILITY).map(member => (
                    <Avatar
                        key={member}
                        size={22}
                        className={style.user}
                        user={projectState.members.find((m) => m.id === member)}
                    />
                ))}
            </div>
        </div>
    )
};

export default Users;
