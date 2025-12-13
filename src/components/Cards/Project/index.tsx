import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import style from './ProjectCard.module.scss';
import ProjectMenu from '../../Menus/Project';
import { IProjectPreviewCard } from '../../../pages/ProjectsPage';
import { setProjectId } from '../../../redux/reducers/projectReducer';
import { RootState } from '../../../redux/store';
import BoardCard from '../Board';
import { useGetProject } from '../../../utils/fetch/getProjectById';


interface ProjectCardProps {
    project: IProjectPreviewCard;
    setProjects: React.Dispatch<React.SetStateAction<IProjectPreviewCard[]>>;
    setOpenModalCreateBoard: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, setProjects, setOpenModalCreateBoard }) => {
    const { getProject } = useGetProject();
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);

    const userState = useSelector((state: RootState) => state.userReducer);
    const projectState = useSelector((state: RootState) => state.projectReducer);

    const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
    const [isOpenBoards, setIsOpenBoards] = useState<boolean>(false);
    const [boardsHeight, setBoardsHeight] = useState<number>(0);
    const boardsRef = useRef<HTMLDivElement>(null);

    const projectId = searchParams.get('projectId');
    const boardId = searchParams.get('boardId');

    const isActiveProject = projectId === project.id;

    useEffect(() => {
        if (boardsRef.current) {
            setBoardsHeight(boardsRef.current.scrollHeight);
        }
    }, [project.boards]);

    useEffect(() => {
        if (isOpenMenu)
            if (projectId != project.id || projectId != projectState.id) {
                const id = project.id || "";
                navigate(`?projectId=${id}`, { replace: true });
                getProject(id || "");
            }
    }, [isOpenMenu]);

    useEffect(() => {
        setIsOpenBoards(isActiveProject);

        requestAnimationFrame(() => {
            if (boardsRef.current) {
                setBoardsHeight(boardsRef.current.scrollHeight);
            }
        });
    }, [isActiveProject]);

    return (
        <div style={{ position: 'relative', display: 'flex' }}>
            <div className={style.projectContainer}>
                <div
                    className={style.projectHeader}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsOpenBoards(!isOpenBoards);
                    }}>
                    <div className={style.headerLeft}>
                        <img
                            src='./icons/Settings.svg'
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsOpenMenu(true);
                            }} />
                        <span className={style.projectName}>{project.name}</span>
                    </div>
                    <Link
                        onClick={() => dispatch(setProjectId({ id: project.id }))}
                        to={`/projects${!isOpenBoards ? `?projectId=${project.id}` : ''}`}>
                        <img
                            className={`${isOpenBoards ? style.active : ''} ${style.arrowIcon}`}
                            src='./icons/Arrow.svg' />
                    </Link>
                </div>

                <div
                    className={style.projectBoardsWrapper}
                    style={{
                        height: isOpenBoards ? boardsHeight - 20 : 0, // 20 = PaddingTop
                        paddingTop: isOpenBoards ? 20 : 0,
                        paddingBottom: isOpenBoards ? 5 : 0,
                    }}
                    ref={boardsRef}>

                    {project.boards?.map((board) => (
                        <BoardCard
                            key={board.id}
                            project={project}
                            board={board}
                            boardId={boardId}
                            setProjects={setProjects} />
                    ))}
                    {project.ownerId == userState.id && project?.boards?.length < 12 &&
                        <div
                            onClick={() => setOpenModalCreateBoard(true)}
                            className={style.containerAddBoard}>
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                <rect x="3" width="2" height="8" rx="1" fill="#D4D4D4" />
                                <rect x="8" y="3" width="2" height="8" rx="1" transform="rotate(90 8 3)" fill="#D4D4D4" />
                            </svg>
                            {/* SVG - Copy Paste, TODO: Move to SVG File */}
                            <span>Add board</span>
                        </div>
                    }
                </div>
            </div>

            <ProjectMenu
                isOpen={isOpenMenu}
                project={project}
                onClose={() => setIsOpenMenu(false)}
                setProjects={setProjects} />
        </div>
    );
};

export default ProjectCard;
