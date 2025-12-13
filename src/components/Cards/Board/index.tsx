import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import style from './BoardCard.module.scss';
import { IBoardPreviewCard, IProjectPreviewCard } from '../../../pages/ProjectsPage';
import { RootState } from '../../../redux/store';
import BoardMenu from '../../../components/Menus/Board';


interface BoardCardProps {
    project: IProjectPreviewCard;
    board: IBoardPreviewCard;
    boardId: string | null;
    setProjects: React.Dispatch<React.SetStateAction<IProjectPreviewCard[]>>;
}

const BoardCard: React.FC<BoardCardProps> = ({
    project,
    board,
    boardId,
    setProjects,
}) => {
    const userState = useSelector((state: RootState) => state.userReducer);

    const [isOpenBoardMenu, setIsOpenBoardMenu] = useState<boolean>(false);

    return (
        <>
            <Link
                key={board.id}
                to={`/projects?projectId=${project.id}&boardId=${board.id}`}
                className={` ${style.containerBoard} ${boardId === board.id ? style.containerActiveBoard : ''}`}>
                <div>
                    <span />
                    <a>{board.name}</a>
                </div>
                {project.ownerId == userState.id &&
                    <img
                        src='./icons/Settings.svg'
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsOpenBoardMenu(true)
                        }} />
                }
            </Link>
            <BoardMenu
                isOpen={isOpenBoardMenu}
                project={project}
                board={board}
                onClose={() => setIsOpenBoardMenu(false)}
                setProjects={setProjects} />
        </>
    );
};

export default BoardCard;
